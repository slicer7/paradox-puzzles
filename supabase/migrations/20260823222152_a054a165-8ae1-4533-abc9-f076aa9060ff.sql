ALTER VIEW public.product_reviews_public SET (security_invoker = true);
REVOKE SELECT ON public.product_reviews_public FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_approved_reviews(_product_handle text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  product_handle text,
  product_title text,
  reviewer_name text,
  rating smallint,
  title text,
  text text,
  approved_at timestamptz,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT r.id, r.product_handle, r.product_title, r.reviewer_name, r.rating, r.title, r.text, r.approved_at, r.created_at
  FROM public.product_reviews r
  WHERE r.status = 'approved'
    AND (_product_handle IS NULL OR r.product_handle = _product_handle)
  ORDER BY COALESCE(r.approved_at, r.created_at) DESC
$$;

GRANT EXECUTE ON FUNCTION public.get_approved_reviews(text) TO anon, authenticated;