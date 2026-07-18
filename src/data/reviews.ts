import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  productHandle: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  title: string;
  text: string;
}

export function useReviewsForProduct(handle: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (supabase as any)
      .from("product_reviews_public")
      .select("product_handle, reviewer_name, rating, title, text, approved_at, created_at")
      .eq("product_handle", handle)
      .order("approved_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setReviews([]);
        } else {
          setReviews(
            data.map((r) => ({
              productHandle: r.product_handle,
              name: r.reviewer_name || "Anonymous",
              rating: r.rating as 1 | 2 | 3 | 4 | 5,
              date: (r.approved_at ?? r.created_at) as string,
              title: r.title ?? "",
              text: r.text,
            }))
          );
        }
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return { reviews, loading };
}

export function getAverageRating(items: Review[]): number | null {
  if (items.length === 0) return null;
  return items.reduce((sum, r) => sum + r.rating, 0) / items.length;
}
