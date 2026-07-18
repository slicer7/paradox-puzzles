
-- Remove the public RLS policy and revoke all column grants on the base table
DROP POLICY IF EXISTS "Approved reviews are public" ON public.product_reviews;

REVOKE ALL ON public.product_reviews FROM anon;
REVOKE ALL ON public.product_reviews FROM authenticated;
REVOKE SELECT (id, product_handle, product_title, reviewer_name, rating, title, text, status, approved_at, created_at) ON public.product_reviews FROM anon;
REVOKE SELECT (id, product_handle, product_title, reviewer_name, rating, title, text, status, approved_at, created_at) ON public.product_reviews FROM authenticated;

-- Safe public view: only approved reviews, only non-sensitive columns
CREATE OR REPLACE VIEW public.product_reviews_public
WITH (security_invoker = true) AS
SELECT
  id,
  product_handle,
  product_title,
  reviewer_name,
  rating,
  title,
  text,
  approved_at,
  created_at
FROM public.product_reviews
WHERE status = 'approved';

GRANT SELECT ON public.product_reviews_public TO anon, authenticated;
