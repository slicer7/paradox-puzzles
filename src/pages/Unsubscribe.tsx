import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type State = "loading" | "valid" | "already" | "invalid" | "submitting" | "success" | "error";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: supabaseAnonKey } }
        );
        const data = await res.json();
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch {
        setState("error");
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState("submitting");
    const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
      body: { token },
    });
    if (error || !data?.success) setState(data?.reason === "already_unsubscribed" ? "already" : "error");
    else setState("success");
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center rounded-xl border border-border/60 bg-card p-8">
        <h1 className="font-display text-3xl font-bold mb-4">Unsubscribe</h1>

        {state === "loading" && (
          <p className="font-body text-muted-foreground">Checking your link…</p>
        )}

        {state === "valid" && (
          <>
            <p className="font-body text-muted-foreground mb-6">
              Click below to unsubscribe from Paradox Puzzle Box emails.
            </p>
            <Button
              onClick={confirm}
              className="bg-primary text-primary-foreground hover:bg-gold-light font-body font-semibold"
            >
              Confirm unsubscribe
            </Button>
          </>
        )}

        {state === "submitting" && (
          <p className="font-body text-muted-foreground">Unsubscribing…</p>
        )}

        {state === "success" && (
          <p className="font-body text-foreground">
            You've been unsubscribed. Sorry to see you go.
          </p>
        )}

        {state === "already" && (
          <p className="font-body text-muted-foreground">
            This address is already unsubscribed.
          </p>
        )}

        {state === "invalid" && (
          <p className="font-body text-muted-foreground">
            This unsubscribe link is invalid or has expired.
          </p>
        )}

        {state === "error" && (
          <p className="font-body text-destructive">
            Something went wrong. Please try again later.
          </p>
        )}

        <div className="mt-8">
          <Link to="/" className="font-body text-sm text-primary hover:underline">
            Return to Paradox Puzzle Box
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Unsubscribe;
