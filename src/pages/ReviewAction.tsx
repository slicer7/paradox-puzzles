import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ReviewPreview {
  id: string;
  product_handle: string;
  product_title: string;
  reviewer_name: string;
  rating: number;
  title: string | null;
  text: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

type State =
  | { kind: "loading" }
  | { kind: "invalid" }
  | { kind: "already"; status: string }
  | { kind: "ready"; review: ReviewPreview }
  | { kind: "submitting"; review: ReviewPreview }
  | { kind: "done"; status: "approved" | "rejected" };

const ReviewAction = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const action = params.get("action") === "reject" ? "reject" : "approve";
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    supabase.functions
      .invoke("moderate-review", { method: "GET" as any, body: undefined as any })
      .then(async () => {
        // supabase-js doesn't support GET with query easily; use fetch instead.
      });
    (async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moderate-review?token=${encodeURIComponent(token)}`;
        const res = await fetch(url, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        const data = await res.json();
        if (!res.ok || !data?.review) {
          setState({ kind: "invalid" });
          return;
        }
        if (data.review.status !== "pending") {
          setState({ kind: "already", status: data.review.status });
          return;
        }
        setState({ kind: "ready", review: data.review });
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (state.kind !== "ready") return;
    const review = state.review;
    setState({ kind: "submitting", review });
    try {
      const { data, error } = await supabase.functions.invoke("moderate-review", {
        body: { token, action },
      });
      if (error || !data?.success) {
        if (data?.reason === "already_moderated") {
          setState({ kind: "already", status: data.status ?? "moderated" });
        } else {
          setState({ kind: "invalid" });
        }
        return;
      }
      setState({ kind: "done", status: action === "approve" ? "approved" : "rejected" });
    } catch {
      setState({ kind: "invalid" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-2xl border border-border/60 bg-card p-8 md:p-10"
      >
        {state.kind === "loading" && (
          <div className="flex flex-col items-center text-center gap-3 py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="font-body text-muted-foreground">Loading review…</p>
          </div>
        )}

        {state.kind === "invalid" && (
          <div className="text-center">
            <XCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Link invalid or expired
            </h1>
            <p className="font-body text-muted-foreground mb-6">
              This approval link isn't valid. It may already have been used.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        )}

        {state.kind === "already" && (
          <div className="text-center">
            <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Already handled
            </h1>
            <p className="font-body text-muted-foreground mb-6">
              This review has already been {state.status}.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        )}

        {(state.kind === "ready" || state.kind === "submitting") && (
          <>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
              {action === "approve" ? "Approve this review?" : "Reject this review?"}
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-6">
              {action === "approve"
                ? "It will be published on the product page immediately."
                : "It will be discarded and never appear on the site."}
            </p>

            <div className="rounded-lg border border-border/60 bg-background/50 p-5 mb-6">
              <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {state.review.product_title}
              </p>
              <p className="font-display text-lg text-primary mb-2">
                {"★".repeat(state.review.rating)}
                <span className="text-muted-foreground/40">
                  {"★".repeat(5 - state.review.rating)}
                </span>
              </p>
              {state.review.title && (
                <p className="font-body font-semibold text-foreground mb-1">
                  {state.review.title}
                </p>
              )}
              <p className="font-body text-sm text-muted-foreground whitespace-pre-wrap mb-3">
                {state.review.text}
              </p>
              <p className="font-body text-xs text-foreground">
                — {state.review.reviewer_name}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={confirm}
                disabled={state.kind === "submitting"}
                className={
                  action === "approve"
                    ? "bg-primary text-primary-foreground hover:bg-gold-light font-body font-semibold flex-1"
                    : "font-body font-semibold flex-1"
                }
                variant={action === "approve" ? "default" : "destructive"}
              >
                {state.kind === "submitting"
                  ? "Working…"
                  : action === "approve"
                  ? "Yes, publish it"
                  : "Yes, reject it"}
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">Cancel</Link>
              </Button>
            </div>
          </>
        )}

        {state.kind === "done" && (
          <div className="text-center">
            <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {state.status === "approved" ? "Review published" : "Review rejected"}
            </h1>
            <p className="font-body text-muted-foreground mb-6">
              {state.status === "approved"
                ? "It's now live on the product page."
                : "It's been discarded and won't be shown."}
            </p>
            <Button asChild variant="outline">
              <Link to="/">Back to site</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewAction;
