import { Star, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductRating } from "@/data/reviews";
import { difficultyLabel } from "@/lib/difficulty";

export const Stars = ({
  value,
  size = "sm",
  className,
}: {
  value: number;
  size?: "sm" | "md";
  className?: string;
}) => (
  <div
    className={cn("flex items-center gap-0.5", className)}
    aria-label={`${value.toFixed(1)} out of 5 stars`}
  >
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        className={cn(
          size === "md" ? "w-5 h-5" : "w-4 h-4",
          i <= Math.round(value) ? "fill-primary text-primary" : "text-muted-foreground/40",
        )}
      />
    ))}
  </div>
);

/** Compact "★★★★★ 5.0 (3)" summary of approved reviews for a product. */
export const ProductRating = ({
  handle,
  size = "sm",
  className,
}: {
  handle: string;
  size?: "sm" | "md";
  className?: string;
}) => {
  const { average, count } = useProductRating(handle);
  if (!average || count === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Stars value={average} size={size} />
      <span className="font-body text-sm text-muted-foreground">
        {average.toFixed(1)} ({count})
      </span>
    </div>
  );
};

export const DifficultyMeter = ({
  value,
  className,
  showLabel = true,
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
}) => (
  <div
    className={cn("flex items-center gap-2", className)}
    aria-label={`Difficulty ${value} out of 5 — ${difficultyLabel(value)}`}
  >
    <Brain className="w-4 h-4 text-primary" />
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 w-4 rounded-full",
            i <= value ? "bg-primary" : "bg-muted-foreground/25",
          )}
        />
      ))}
    </div>
    {showLabel && (
      <span className="font-body text-sm text-muted-foreground">{difficultyLabel(value)}</span>
    )}
  </div>
);
