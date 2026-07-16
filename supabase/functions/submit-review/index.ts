import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const BodySchema = z.object({
  productHandle: z.string().trim().min(1).max(200),
  productTitle: z.string().trim().min(1).max(300),
  reviewerName: z.string().trim().max(100).optional().default(''),
  reviewerEmail: z.string().trim().email().max(255).optional().or(z.literal('')),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(200).optional().default(''),
  text: z.string().trim().min(1).max(4000),
  siteOrigin: z.string().trim().url().max(255),
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return jsonResponse({ error: 'Server misconfigured' }, 500)

  let raw: unknown
  try { raw = await req.json() } catch { return jsonResponse({ error: 'Invalid JSON' }, 400) }
  const parsed = BodySchema.safeParse(raw)
  if (!parsed.success) return jsonResponse({ error: parsed.error.flatten().fieldErrors }, 400)

  const b = parsed.data
  const reviewerName = b.reviewerName || 'Anonymous'
  const reviewerEmail = b.reviewerEmail || null
  const token = generateToken()

  const supabase = createClient(supabaseUrl, serviceKey)

  const { data: inserted, error: insertError } = await supabase
    .from('product_reviews')
    .insert({
      product_handle: b.productHandle,
      product_title: b.productTitle,
      reviewer_name: reviewerName,
      reviewer_email: reviewerEmail,
      rating: b.rating,
      title: b.title || null,
      text: b.text,
      action_token: token,
    })
    .select('id')
    .maybeSingle()

  if (insertError || !inserted) {
    console.error('Failed to insert review', insertError)
    return jsonResponse({ error: 'Failed to save review' }, 500)
  }

  const origin = b.siteOrigin.replace(/\/$/, '')
  const approveUrl = `${origin}/review-action?token=${token}&action=approve`
  const rejectUrl = `${origin}/review-action?token=${token}&action=reject`

  const { error: emailError } = await supabase.functions.invoke('send-transactional-email', {
    body: {
      templateName: 'review-submission',
      idempotencyKey: `review-${inserted.id}`,
      templateData: {
        productTitle: b.productTitle,
        productHandle: b.productHandle,
        reviewerName,
        reviewerEmail: reviewerEmail ?? '',
        rating: b.rating,
        title: b.title ?? '',
        text: b.text,
        submittedAt: new Date().toISOString(),
        approveUrl,
        rejectUrl,
      },
    },
  })

  if (emailError) {
    console.error('Failed to send notification email', emailError)
    // Review is saved; owner can still approve via DB if needed.
  }

  return jsonResponse({ success: true, id: inserted.id })
})
