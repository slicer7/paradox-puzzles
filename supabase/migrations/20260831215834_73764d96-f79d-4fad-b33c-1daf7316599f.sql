-- Revert to invoker view (no SECURITY DEFINER view), enforce column-level grants
CREATE OR REPLACE VIEW public.product_reviews_public
WITH (security_invoker = true) AS
SELECT id, product_handle, product_title, reviewer_name, rating, title, text, approved_at, created_at
FROM public.product_reviews
WHERE status = 'approved';

REVOKE ALL ON public.product_reviews FROM anon, authenticated;

-- Only approved rows are readable, and only via safe columns
CREATE POLICY "Anyone can read approved reviews"
ON public.product_reviews
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

GRANT SELECT (id, product_handle, product_title, reviewer_name, rating, title, text, status, approved_at, created_at)
ON public.product_reviews TO anon, authenticated;

REVOKE ALL ON public.product_reviews_public FROM anon, authenticated;
GRANT SELECT ON public.product_reviews_public TO anon, authenticated;
GRANT ALL ON public.product_reviews TO service_role;