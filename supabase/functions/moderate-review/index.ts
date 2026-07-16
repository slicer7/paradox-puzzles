import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return jsonResponse({ error: 'Server misconfigured' }, 500)

  const supabase = createClient(supabaseUrl, serviceKey)
  const url = new URL(req.url)

  let token: string | null = url.searchParams.get('token')
  let action: string | null = url.searchParams.get('action')

  if (req.method === 'POST') {
    try {
      const body = await req.json()
      if (body.token) token = body.token
      if (body.action) action = body.action
    } catch { /* keep query values */ }
  }

  if (!token || typeof token !== 'string' || token.length < 16) {
    return jsonResponse({ error: 'Invalid token' }, 400)
  }

  const { data: review, error: lookupError } = await supabase
    .from('product_reviews')
    .select('id, product_handle, product_title, reviewer_name, rating, title, text, status, created_at')
    .eq('action_token', token)
    .maybeSingle()

  if (lookupError || !review) {
    return jsonResponse({ error: 'Review not found' }, 404)
  }

  if (req.method === 'GET') {
    return jsonResponse({ review })
  }

  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405)

  if (review.status !== 'pending') {
    return jsonResponse({ success: false, status: review.status, reason: 'already_moderated' })
  }

  if (action !== 'approve' && action !== 'reject') {
    return jsonResponse({ error: 'Invalid action' }, 400)
  }

  const newStatus = action === 'approve' ? 'approved' : 'rejected'
  const { data: updated, error: updateError } = await supabase
    .from('product_reviews')
    .update({
      status: newStatus,
      approved_at: action === 'approve' ? new Date().toISOString() : null,
    })
    .eq('action_token', token)
    .eq('status', 'pending')
    .select('id, status')
    .maybeSingle()

  if (updateError) {
    console.error('Failed to update review', updateError)
    return jsonResponse({ error: 'Failed to update review' }, 500)
  }

  if (!updated) {
    return jsonResponse({ success: false, reason: 'already_moderated' })
  }

  return jsonResponse({ success: true, status: updated.status })
})
