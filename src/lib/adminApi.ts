import { supabase } from "@/integrations/supabase/client";

export interface AdminImage {
  id: number;
  src: string;
  alt: string | null;
  position: number;
}

export interface AdminVariant {
  id: number;
  title: string;
  price: string;
  compare_at_price: string | null;
  sku: string | null;
}

export interface AdminProduct {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  product_type: string | null;
  tags: string | null;
  status: string;
  images: AdminImage[];
  variants: AdminVariant[];
}

export interface AdminReview {
  id: string;
  product_handle: string;
  product_title: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  text: string;
  status: string;
  created_at: string;
}

export async function adminCall<T = any>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("admin-store", { body });
  if (error) {
    // Try to surface the function's error message
    const message = (data as any)?.error || error.message || "Request failed";
    throw new Error(message);
  }
  if (data && (data as any).error) throw new Error((data as any).error);
  return data as T;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
