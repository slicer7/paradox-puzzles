// Meta Pixel helper. The pixel is initialized in index.html.
// This wrapper safely fires standard events with typed parameters.
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type FbqParams = Record<string, unknown>;

export const fbqTrack = (event: string, params?: FbqParams) => {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    if (params) window.fbq("track", event, params);
    else window.fbq("track", event);
  } catch {
    // no-op
  }
};

export const trackViewContent = (p: {
  id: string;
  name: string;
  price: number | string;
  currency?: string;
}) =>
  fbqTrack("ViewContent", {
    content_ids: [p.id],
    content_name: p.name,
    content_type: "product",
    value: Number(p.price) || 0,
    currency: p.currency || "USD",
  });

export const trackAddToCart = (p: {
  id: string;
  name: string;
  price: number | string;
  quantity?: number;
  currency?: string;
}) =>
  fbqTrack("AddToCart", {
    content_ids: [p.id],
    content_name: p.name,
    content_type: "product",
    value: (Number(p.price) || 0) * (p.quantity || 1),
    currency: p.currency || "USD",
    num_items: p.quantity || 1,
  });

export const trackInitiateCheckout = (p: {
  ids: string[];
  value: number;
  numItems: number;
  currency?: string;
}) =>
  fbqTrack("InitiateCheckout", {
    content_ids: p.ids,
    content_type: "product",
    value: p.value,
    num_items: p.numItems,
    currency: p.currency || "USD",
  });
