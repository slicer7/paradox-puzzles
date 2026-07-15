// Customer reviews shown on product pages.
//
// To add a real review, append an entry to the array below:
// {
//   productHandle: "the-pillar",   // the product's Shopify handle (from its URL)
//   name: "Jane D.",
//   rating: 5,                      // 1-5
//   date: "2026-08-01",             // YYYY-MM-DD
//   title: "Best gift ever",
//   text: "My brother spent 45 minutes trying to get his birthday card out...",
// }
//
// Reviews arrive by email (customers use the "Write a review" button),
// so paste them here once you've read them.

export interface Review {
  productHandle: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  title: string;
  text: string;
}

export const reviews: Review[] = [];

export function getReviewsForProduct(handle: string): Review[] {
  return reviews
    .filter((r) => r.productHandle === handle)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getAverageRating(items: Review[]): number | null {
  if (items.length === 0) return null;
  return items.reduce((sum, r) => sum + r.rating, 0) / items.length;
}
