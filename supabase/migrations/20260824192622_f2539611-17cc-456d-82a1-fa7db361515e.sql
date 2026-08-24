ALTER VIEW public.product_reviews_public SET (security_invoker = true);

REVOKE ALL ON public.product_reviews FROM anon, authenticated;
GRANT SELECT (id, product_handle, product_title, reviewer_name, rating, title, text, approved_at, created_at)
  ON public.product_reviews TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.product_reviews;
CREATE POLICY "Anyone can read approved reviews"
  ON public.product_reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');