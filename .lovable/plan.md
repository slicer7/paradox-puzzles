## Goal
Make Shopify treat "The Pillar" as a physical product so you can enter weight/size and have it calculate shipping.

## Why
Shopify hides the weight/dimensions fields on any variant where "This is a physical product" (a.k.a. `requires_shipping`) is off. Both Pillar variants (Red, Grey) currently have that flag off, so the shipping section is locked.

## Changes (Shopify only — no code changes)
Update both variants of product **The Pillar** (ID 8453185536186) via `shopify--update_product_variant`:

1. Variant **Red** (46159081898170) → `requires_shipping: true`
2. Variant **Grey** (46159081930938) → `requires_shipping: true`

Nothing else on the product, prices, or the Lovable site changes.

## After this runs
In Shopify admin → Products → The Pillar → each variant, the "Shipping" section will be editable. You can then enter weight and package dimensions, and Shopify's carrier-calculated / weight-based rates will apply at checkout.

If you also want me to set a starting weight now (e.g. grams for each variant), tell me the number and I'll include it in the same update.