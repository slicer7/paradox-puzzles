import { useState } from "react";
import { motion } from "framer-motion";
import { Star, PenLine, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { getAverageRating, useReviewsForProduct } from "@/data/reviews";
import { cn } from "@/lib/utils";



const Stars = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i <= Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40"
        )}
      />
    ))}
  </div>
);

const WriteReviewDialog = ({
  productTitle,
  productHandle,
}: {
  productTitle: string;
  productHandle: string;
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "review-submission",
          idempotencyKey: `review-${productHandle}-${Date.now()}`,
          templateData: {
            productTitle,
            productHandle,
            reviewerName: name.trim() || "Anonymous",
            reviewerEmail: email.trim(),
            rating,
            title: title.trim(),
            text: text.trim(),
            submittedAt: new Date().toISOString(),
          },
        },
      });
      if (error) throw error;
      toast.success("Thanks — your review was sent!", {
        description: "We'll read it and publish it soon.",
      });
      setOpen(false);
      setName("");
      setEmail("");
      setTitle("");
      setText("");
      setRating(5);
    } catch (err) {
      console.error("Review submit failed", err);
      toast.error("Couldn't send review", {
        description: "Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border hover:border-primary/60 font-body font-medium">
          <PenLine className="w-4 h-4 mr-2" />
          Write a review
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Review {productTitle}</DialogTitle>
          <DialogDescription className="font-body">
            Send us your review. We read every one and publish the genuine ones on the site.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="font-body">Your rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  aria-label={`${i} star${i > 1 ? "s" : ""}`}
                  className="p-1"
                >
                  <Star
                    className={cn(
                      "w-6 h-6 transition-colors",
                      i <= rating ? "fill-primary text-primary" : "text-muted-foreground/40 hover:text-primary/60"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="review-name" className="font-body">Your name</Label>
              <Input
                id="review-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane D."
                className="bg-input border-border font-body"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-email" className="font-body">Email (optional)</Label>
              <Input
                id="review-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-input border-border font-body"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-title" className="font-body">Title (optional)</Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Best gift ever"
              className="bg-input border-border font-body"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="review-text" className="font-body">Your review</Label>
            <Textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="How was the puzzle? Who did you gift it to?"
              rows={4}
              className="bg-input border-border font-body"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!text.trim() || submitting}
            className="bg-primary text-primary-foreground hover:bg-gold-light font-body font-semibold w-full sm:w-auto"
          >
            {submitting ? "Sending…" : "Send review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ReviewsSection = ({
  productHandle,
  productTitle,
}: {
  productHandle: string;
  productTitle: string;
}) => {
  const { reviews: productReviews } = useReviewsForProduct(productHandle);
  const average = getAverageRating(productReviews);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mt-16 max-w-3xl mx-auto"
      aria-labelledby="reviews-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 id="reviews-heading" className="font-display text-3xl font-bold text-foreground">
            Customer Reviews
          </h2>
          {average !== null && (
            <div className="flex items-center gap-2 mt-2">
              <Stars value={average} />
              <span className="font-body text-sm text-muted-foreground">
                {average.toFixed(1)} · {productReviews.length} review{productReviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <WriteReviewDialog productTitle={productTitle} productHandle={productHandle} />
      </div>

      {productReviews.length === 0 ? (
        <div className="rounded-xl border border-border/60 bg-card p-8 text-center">
          <p className="font-body text-foreground font-medium mb-2">
            No reviews yet — be the first.
          </p>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto leading-relaxed mb-4">
            We're a new workshop and every review helps. Solved it? Gifted it?
            Tell us how it went.
          </p>
          <p className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Every purchase is covered by our 30-day money-back guarantee.
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {productReviews.map((review) => (
            <li key={`${review.name}-${review.date}`} className="rounded-xl border border-border/60 bg-card p-6">
              <div className="flex items-center justify-between gap-4 mb-2">
                <Stars value={review.rating} />
                <span className="font-body text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h3 className="font-body font-semibold text-foreground mb-1">{review.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-3">
                {review.text}
              </p>
              <p className="font-body text-sm text-foreground font-medium">— {review.name}</p>
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
};
