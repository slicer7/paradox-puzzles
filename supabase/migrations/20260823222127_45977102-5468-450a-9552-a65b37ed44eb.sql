ALTER VIEW public.product_reviews_public SET (security_invoker = false);
GRANT SELECT ON public.product_reviews_public TO anon, authenticated;
GRANT ALL ON public.product_reviews TO service_role;