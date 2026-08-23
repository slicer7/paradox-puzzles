import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { adminCall, fileToBase64, AdminProduct, AdminReview } from "@/lib/adminApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ArrowLeft, ArrowRight, Star, LogOut, RefreshCw, ImagePlus } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/admin/login", { replace: true });
      else setEmail(session.user.email ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login", { replace: true });
      else setEmail(data.session.user.email ?? null);
      setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [p, r] = await Promise.all([
        adminCall<{ products: AdminProduct[] }>({ action: "list_products" }),
        adminCall<{ reviews: AdminReview[] }>({ action: "list_reviews" }),
      ]);
      setProducts(p.products);
      setReviews(r.reviews);
      setAuthorized(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not load data";
      if (msg.toLowerCase().includes("authoriz")) {
        setAuthorized(false);
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authChecked && email) refresh();
  }, [authChecked, email, refresh]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background geometric-pattern">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gradient-gold">Store Admin</h1>
            <p className="font-body text-sm text-muted-foreground">{email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="outline" onClick={refresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </header>

        {!authorized && !loading ? (
          <Card className="p-8 text-center font-body text-muted-foreground">
            This account isn't an admin yet. The first account to open this page becomes the admin.
          </Card>
        ) : (
          <Tabs defaultValue="products">
            <TabsList className="mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews
                {reviews.some((r) => r.status === "pending") && (
                  <Badge className="ml-2" variant="secondary">
                    {reviews.filter((r) => r.status === "pending").length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <Button onClick={() => setCreating(true)} className="font-body font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add product
              </Button>

              {loading && products.length === 0 ? (
                <div className="py-16 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map((product) => (
                    <Card key={product.id} className="p-4 flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0].src}
                            alt={product.images[0].alt || product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="font-display text-lg font-semibold truncate">{product.title}</h2>
                        <p className="font-body text-sm text-muted-foreground">
                          ${product.variants?.[0]?.price ?? "0.00"} · {product.images?.length ?? 0} photos ·{" "}
                          {product.status}
                        </p>
                      </div>
                      <Button variant="outline" onClick={() => setEditing(product)}>
                        Edit
                      </Button>
                    </Card>
                  ))}
                  {products.length === 0 && !loading && (
                    <Card className="p-8 text-center font-body text-muted-foreground">No products yet.</Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              {reviews.length === 0 ? (
                <Card className="p-8 text-center font-body text-muted-foreground">No reviews yet.</Card>
              ) : (
                reviews.map((review) => (
                  <Card key={review.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                            />
                          ))}
                          <span className="font-body text-sm text-muted-foreground">{review.reviewer_name}</span>
                        </div>
                        {review.title && <p className="font-display font-semibold mt-1">{review.title}</p>}
                        <p className="font-body text-sm text-muted-foreground mt-1">{review.text}</p>
                        <p className="font-body text-xs text-muted-foreground mt-2">
                          {review.product_title} · {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={review.status === "approved" ? "default" : "secondary"}>{review.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                      {review.status !== "approved" && (
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              await adminCall({ action: "set_review_status", review_id: review.id, status: "approved" });
                              toast.success("Review approved");
                              refresh();
                            } catch (e) {
                              toast.error(e instanceof Error ? e.message : "Failed");
                            }
                          }}
                        >
                          Approve
                        </Button>
                      )}
                      {review.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              await adminCall({ action: "set_review_status", review_id: review.id, status: "rejected" });
                              toast.success("Review hidden");
                              refresh();
                            } catch (e) {
                              toast.error(e instanceof Error ? e.message : "Failed");
                            }
                          }}
                        >
                          Reject
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          if (!confirm("Delete this review permanently?")) return;
                          try {
                            await adminCall({ action: "delete_review", review_id: review.id });
                            toast.success("Review deleted");
                            refresh();
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : "Failed");
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>

                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {editing && (
        <ProductEditor
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditing(updated);
          }}
          onDeleted={(id) => {
            setProducts((prev) => prev.filter((p) => p.id !== id));
            setEditing(null);
          }}
        />
      )}

      {creating && (
        <ProductCreator
          onClose={() => setCreating(false)}
          onCreated={(product) => {
            setProducts((prev) => [product, ...prev]);
            setCreating(false);
            setEditing(product);
          }}
        />
      )}
    </main>
  );
};

const ProductCreator = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (p: AdminProduct) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { product } = await adminCall<{ product: AdminProduct }>({
        action: "create_product",
        product: { title, description, price },
      });
      toast.success("Product created — now add photos");
      onCreated(product);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">New product</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-title">Title</Label>
            <Input id="new-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-price">Price (USD)</Label>
            <Input
              id="new-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-desc">Description</Label>
            <Textarea id="new-desc" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button type="submit" disabled={saving} className="w-full font-body font-semibold">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ProductEditor = ({
  product,
  onClose,
  onSaved,
  onDeleted,
}: {
  product: AdminProduct;
  onClose: () => void;
  onSaved: (p: AdminProduct) => void;
  onDeleted: (id: number) => void;
}) => {
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.body_html ?? "");
  const [price, setPrice] = useState(product.variants?.[0]?.price ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTitle(product.title);
    setDescription(product.body_html ?? "");
    setPrice(product.variants?.[0]?.price ?? "");
  }, [product]);

  const reload = async () => {
    const { product: fresh } = await adminCall<{ product: AdminProduct }>({
      action: "get_product",
      id: product.id,
    });
    onSaved(fresh);
  };

  const saveDetails = async () => {
    setSaving(true);
    try {
      await adminCall({ action: "update_product", id: product.id, product: { title, description } });
      const variantId = product.variants?.[0]?.id;
      if (variantId && price) {
        await adminCall({ action: "update_variant", variant_id: variantId, price });
      }
      await reload();
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const attachment = await fileToBase64(file);
        await adminCall({
          action: "add_image",
          id: product.id,
          attachment,
          filename: file.name,
          alt: title,
        });
      }
      await reload();
      toast.success("Photos added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    const ids = product.images.map((img) => img.id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    try {
      await adminCall({ action: "reorder_images", id: product.id, image_ids: ids });
      await reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reorder");
    }
  };

  const removeImage = async (imageId: number) => {
    try {
      await adminCall({ action: "delete_image", id: product.id, image_id: imageId });
      await reload();
      toast.success("Photo removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove photo");
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Edit {product.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-price">Price (USD)</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-desc">Description</Label>
            <Textarea id="edit-desc" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button onClick={saveDetails} disabled={saving} className="font-body font-semibold">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save changes
          </Button>

          <div className="pt-4 border-t border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Photos</h3>
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-body text-primary">
                <ImagePlus className="w-4 h-4" />
                {uploading ? "Uploading..." : "Add photos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => uploadFiles(e.target.files)}
                />
              </label>
            </div>
            <p className="font-body text-xs text-muted-foreground">
              The first photo is the main product image.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {product.images.map((image, index) => (
                <div key={image.id} className="rounded-lg overflow-hidden border border-border/60">
                  <img src={image.src} alt={image.alt || title} className="w-full aspect-square object-cover" />
                  <div className="flex items-center justify-between p-1">
                    <Button size="icon" variant="ghost" onClick={() => moveImage(index, -1)} aria-label="Move left">
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => moveImage(index, 1)} aria-label="Move right">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => removeImage(image.id)} aria-label="Delete photo">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <Button
              variant="outline"
              className="text-destructive"
              onClick={async () => {
                if (!confirm("Delete this product from Shopify? This cannot be undone.")) return;
                try {
                  await adminCall({ action: "delete_product", id: product.id });
                  toast.success("Product deleted");
                  onDeleted(product.id);
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not delete");
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete product
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Admin;
