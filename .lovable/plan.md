## Goal
Approve (or reject) customer reviews without editing `src/data/reviews.ts`. Reviews get stored in the database, and the notification email to `paradoxpuzzlebox@gmail.com` includes one-click **Approve** and **Reject** links. Approved reviews automatically appear on the product page.

## How it will work

1. Customer submits a review from the product page (same form as today).
2. Review is saved to the database with status `pending` and a signed one-time token.
3. You get the notification email — now with two buttons:
   - **Approve & publish** → review appears on the site immediately.
   - **Reject** → review is discarded.
4. Clicking a link opens a small confirmation page (`/review-action?token=...`) so accidental clicks don't auto-approve. One confirm click finalizes it.
5. The product page reads approved reviews from the database instead of the hardcoded file.

No login required — security comes from the signed token (same pattern as the unsubscribe link).

## What gets built

**Database**
- New `product_reviews` table: `id`, `product_handle`, `product_title`, `reviewer_name`, `reviewer_email`, `rating`, `title`, `text`, `status` (`pending` | `approved` | `rejected`), `action_token`, `created_at`, `approved_at`.
- RLS: public can `SELECT` only rows where `status = 'approved'`. Inserts/updates go through edge functions using the service role.

**Edge functions**
- `submit-review` — validates input, inserts the pending row, generates the token, then invokes `send-transactional-email` with the approve/reject URLs.
- `moderate-review` — `GET` validates the token and returns review details; `POST` applies the action (`approve` or `reject`) and marks the token used.

**Email template**
- Update `review-submission.tsx` to include prominent **Approve & publish** and **Reject** buttons pointing to `/review-action?token=...&action=approve|reject`.

**Frontend**
- New page `/review-action` (`src/pages/ReviewAction.tsx`) — shows the review, an "Are you sure?" confirmation, and success/error states. Modeled on the existing `Unsubscribe` page.
- `ReviewsSection.tsx` — calls `submit-review` instead of `send-transactional-email` directly; keeps the same UX.
- `src/data/reviews.ts` — replaced by a `useReviews(handle)` hook that queries the database. The legacy hardcoded array is removed (it's empty anyway).

## Notes

- Existing customer-facing form and product page UI stay the same visually.
- Manual editing of `src/data/reviews.ts` will no longer be needed — everything is one click from the inbox.
- Rejected reviews stay in the DB (marked rejected) so nothing gets accidentally re-submitted; they never render on the site.
