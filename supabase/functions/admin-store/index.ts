import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const SHOP_DOMAIN = 'smepzx-ym.myshopify.com'
const API_VERSION = '2025-07'

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

let cachedToken: { value: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value

  const clientId = Deno.env.get('SHOPIFY_CLIENT_ID')
  const clientSecret = Deno.env.get('SHOPIFY_CLIENT_SECRET')
  if (!clientId || !clientSecret) {
    const staticToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN')
    if (staticToken) return staticToken
    throw new Error('Shopify credentials not configured')
  }

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`Shopify token ${res.status}: ${text.slice(0, 300)}`)
  const data = JSON.parse(text) as { access_token: string; expires_in?: number }
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  }
  return cachedToken.value
}

async function shopify(path: string, init: RequestInit = {}) {
  const token = await getAccessToken()
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/${path}`, {
    ...init,
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  const text = await res.text()
  let body: unknown = null
  try { body = text ? JSON.parse(text) : null } catch { body = { raw: text } }
  if (!res.ok) {
    throw new Error(`Shopify ${res.status}: ${text.slice(0, 500)}`)
  }
  return body as Record<string, any>
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !serviceKey || !anonKey) return json({ error: 'Server misconfigured' }, 500)

  const authHeader = req.headers.get('Authorization') ?? ''
  const jwt = authHeader.replace(/^Bearer\s+/i, '')
  if (!jwt) return json({ error: 'Not authenticated' }, 401)

  const authClient = createClient(supabaseUrl, anonKey)
  const { data: userData, error: userErr } = await authClient.auth.getUser(jwt)
  const user = userData?.user
  if (userErr || !user) return json({ error: 'Not authenticated' }, 401)

  const admin = createClient(supabaseUrl, serviceKey)

  // Role check. Admin roles are granted by the owner account (or in SQL) only —
  // no self-service bootstrap from this publicly reachable endpoint.
  const { data: isAdminData } = await admin.rpc('has_role', { _user_id: user.id, _role: 'admin' })
  if (!isAdminData) return json({ error: 'Not authorized' }, 403)

  const isOwner = (user.email ?? '').toLowerCase() === OWNER_EMAIL

  let payload: Record<string, any>
  try { payload = await req.json() } catch { return json({ error: 'Invalid JSON body' }, 400) }

  const action = String(payload.action ?? '')

  try {
    switch (action) {
      case 'whoami':
        return json({ email: user.email, isAdmin: true, isOwner })

      case 'list_admins': {
        const { data: roles, error } = await admin
          .from('user_roles')
          .select('user_id, created_at')
          .eq('role', 'admin')
        if (error) return json({ error: error.message }, 500)
        const { data: usersPage } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
        const byId = new Map((usersPage?.users ?? []).map((u) => [u.id, u.email ?? '']))
        const admins = (roles ?? []).map((r) => ({
          user_id: r.user_id as string,
          email: byId.get(r.user_id as string) ?? '(unknown)',
          created_at: r.created_at as string,
          is_owner: (byId.get(r.user_id as string) ?? '').toLowerCase() === OWNER_EMAIL,
        }))
        return json({ admins, isOwner })
      }

      case 'add_admin': {
        if (!isOwner) return json({ error: 'Only the main admin can manage admins' }, 403)
        const targetEmail = String(payload.email ?? '').trim().toLowerCase()
        if (!targetEmail || !targetEmail.includes('@')) return json({ error: 'Enter a valid email' }, 400)
        const { data: usersPage } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
        const target = (usersPage?.users ?? []).find((u) => (u.email ?? '').toLowerCase() === targetEmail)
        if (!target) {
          return json({ error: 'No account with that email yet. Ask them to sign in once at /admin/login first.' }, 404)
        }
        const { error } = await admin
          .from('user_roles')
          .upsert({ user_id: target.id, role: 'admin' }, { onConflict: 'user_id,role' })
        if (error) return json({ error: error.message }, 500)
        return json({ success: true })
      }

      case 'remove_admin': {
        if (!isOwner) return json({ error: 'Only the main admin can manage admins' }, 403)
        const targetId = String(payload.user_id ?? '')
        if (!targetId) return json({ error: 'Missing user id' }, 400)
        const { data: targetUser } = await admin.auth.admin.getUserById(targetId)
        if ((targetUser?.user?.email ?? '').toLowerCase() === OWNER_EMAIL) {
          return json({ error: 'The main admin cannot be removed' }, 400)
        }
        const { error } = await admin.from('user_roles').delete().eq('user_id', targetId).eq('role', 'admin')
        if (error) return json({ error: error.message }, 500)
        return json({ success: true })
      }


      case 'list_products': {
        const data = await shopify('products.json?limit=100')
        return json({ products: data.products ?? [] })
      }

      case 'get_product': {
        const id = Number(payload.id)
        if (!id) return json({ error: 'Missing product id' }, 400)
        const data = await shopify(`products/${id}.json`)
        return json({ product: data.product })
      }

      case 'create_product': {
        const p = payload.product ?? {}
        if (!p.title || typeof p.title !== 'string') return json({ error: 'Title is required' }, 400)
        const price = String(p.price ?? '0')
        const body = {
          product: {
            title: p.title,
            body_html: p.description ?? '',
            vendor: p.vendor || 'Paradox Puzzle Box',
            product_type: p.product_type || 'Puzzle Box',
            status: p.status === 'draft' ? 'draft' : 'active',
            tags: p.tags ?? '',
            variants: [
              {
                price,
                sku: p.sku ?? '',
                inventory_management: p.track_inventory ? 'shopify' : null,
                requires_shipping: true,
                weight: p.weight ?? 0,
                weight_unit: p.weight_unit ?? 'lb',
              },
            ],
          },
        }
        const data = await shopify('products.json', { method: 'POST', body: JSON.stringify(body) })
        return json({ product: data.product })
      }

      case 'update_product': {
        const id = Number(payload.id)
        if (!id) return json({ error: 'Missing product id' }, 400)
        const p = payload.product ?? {}
        const fields: Record<string, unknown> = { id }
        if (typeof p.title === 'string') fields.title = p.title
        if (typeof p.description === 'string') fields.body_html = p.description
        if (typeof p.tags === 'string') fields.tags = p.tags
        if (typeof p.product_type === 'string') fields.product_type = p.product_type
        if (p.status === 'active' || p.status === 'draft') fields.status = p.status
        const data = await shopify(`products/${id}.json`, {
          method: 'PUT',
          body: JSON.stringify({ product: fields }),
        })
        return json({ product: data.product })
      }

      case 'update_variant': {
        const variantId = Number(payload.variant_id)
        if (!variantId) return json({ error: 'Missing variant id' }, 400)
        const v: Record<string, unknown> = { id: variantId }
        if (payload.price != null) v.price = String(payload.price)
        if (payload.compare_at_price != null) v.compare_at_price = String(payload.compare_at_price) || null
        const data = await shopify(`variants/${variantId}.json`, {
          method: 'PUT',
          body: JSON.stringify({ variant: v }),
        })
        return json({ variant: data.variant })
      }

      case 'add_image': {
        const id = Number(payload.id)
        if (!id) return json({ error: 'Missing product id' }, 400)
        const image: Record<string, unknown> = { alt: payload.alt ?? '' }
        if (payload.attachment) {
          image.attachment = String(payload.attachment)
          if (payload.filename) image.filename = String(payload.filename)
        } else if (payload.src) {
          image.src = String(payload.src)
        } else {
          return json({ error: 'Provide an image file or URL' }, 400)
        }
        const data = await shopify(`products/${id}/images.json`, {
          method: 'POST',
          body: JSON.stringify({ image }),
        })
        return json({ image: data.image })
      }

      case 'delete_image': {
        const id = Number(payload.id)
        const imageId = Number(payload.image_id)
        if (!id || !imageId) return json({ error: 'Missing ids' }, 400)
        await shopify(`products/${id}/images/${imageId}.json`, { method: 'DELETE' })
        return json({ success: true })
      }

      case 'reorder_images': {
        const id = Number(payload.id)
        const order: number[] = Array.isArray(payload.image_ids) ? payload.image_ids.map(Number) : []
        if (!id || order.length === 0) return json({ error: 'Missing ids' }, 400)
        const images = order.map((imageId, index) => ({ id: imageId, position: index + 1 }))
        const data = await shopify(`products/${id}.json`, {
          method: 'PUT',
          body: JSON.stringify({ product: { id, images } }),
        })
        return json({ product: data.product })
      }

      case 'delete_product': {
        const id = Number(payload.id)
        if (!id) return json({ error: 'Missing product id' }, 400)
        await shopify(`products/${id}.json`, { method: 'DELETE' })
        return json({ success: true })
      }

      case 'list_reviews': {
        const { data, error } = await admin
          .from('product_reviews')
          .select('id, product_handle, product_title, reviewer_name, rating, title, text, status, created_at')
          .order('created_at', { ascending: false })
          .limit(200)
        if (error) return json({ error: error.message }, 500)
        return json({ reviews: data ?? [] })
      }

      case 'set_review_status': {
        const reviewId = String(payload.review_id ?? '')
        const status = String(payload.status ?? '')
        if (!reviewId || !['approved', 'rejected', 'pending'].includes(status)) {
          return json({ error: 'Invalid review update' }, 400)
        }
        const { error } = await admin
          .from('product_reviews')
          .update({ status, approved_at: status === 'approved' ? new Date().toISOString() : null })
          .eq('id', reviewId)
        if (error) return json({ error: error.message }, 500)
        return json({ success: true })
      }

      case 'delete_review': {
        const reviewId = String(payload.review_id ?? '')
        if (!reviewId) return json({ error: 'Missing review id' }, 400)
        const { error } = await admin.from('product_reviews').delete().eq('id', reviewId)
        if (error) return json({ error: error.message }, 500)
        return json({ success: true })
      }


      default:
        return json({ error: 'Unknown action' }, 400)
    }
  } catch (e) {
    console.error('admin-store error', e)
    return json({ error: e instanceof Error ? e.message : 'Unexpected error' }, 500)
  }
})
