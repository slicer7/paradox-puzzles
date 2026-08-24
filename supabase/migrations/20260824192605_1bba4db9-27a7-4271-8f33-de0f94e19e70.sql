CREATE OR REPLACE VIEW public.product_reviews_public
WITH (security_barrier = true) AS
SELECT r.id, r.product_handle, r.product_title, r.reviewer_name, r.rating, r.title, r.text, r.approved_at, r.created_at
FROM public.product_reviews r
WHERE r.status = 'approved';

REVOKE ALL ON public.product_reviews_public FROM PUBLIC;
GRANT SELECT ON public.product_reviews_public TO anon, authenticated;
GRANT ALL ON public.product_reviews_public TO service_role;

CREATE OR REPLACE FUNCTION public.get_approved_reviews(_product_handle text DEFAULT NULL::text)
RETURNS TABLE(id uuid, product_handle text, product_title text, reviewer_name text, rating smallint, title text, text text, approved_at timestamp with time zone, created_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT v.id, v.product_handle, v.product_title, v.reviewer_name, v.rating, v.title, v.text, v.approved_at, v.created_at
  FROM public.product_reviews_public v
  WHERE (_product_handle IS NULL OR v.product_handle = _product_handle)
  ORDER BY COALESCE(v.approved_at, v.created_at) DESC
$function$;

REVOKE ALL ON FUNCTION public.get_approved_reviews(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_approved_reviews(text) TO anon, authenticated, service_role;