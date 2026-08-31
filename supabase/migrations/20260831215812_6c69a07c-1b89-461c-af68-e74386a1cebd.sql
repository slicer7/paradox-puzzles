-- Remove all direct public access to the base table
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.product_reviews;
REVOKE ALL ON public.product_reviews FROM anon, authenticated;

-- Public reads go only through the column-limited view
CREATE OR REPLACE VIEW public.product_reviews_public
WITH (security_invoker = false) AS
SELECT id, product_handle, product_title, reviewer_name, rating, title, text, approved_at, created_at
FROM public.product_reviews
WHERE status = 'approved';

REVOKE ALL ON public.product_reviews_public FROM anon, authenticated;
GRANT SELECT ON public.product_reviews_public TO anon, authenticated;
GRANT ALL ON public.product_reviews TO service_role;