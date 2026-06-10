import { useState, type ReactNode, type TextareaHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{eyebrow}</div>
      <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
        <span className="aura-text">{title}</span>
      </h2>
      <p className="mt-3 text-muted-foreground max-w-2xl">{description}</p>
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass-strong rounded-2xl p-5 sm:p-6 soft-shadow", className)}>{children}</div>;
}

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">{children}</label>;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl bg-input/60 border border-glass-border px-4 py-3 text-sm leading-relaxed",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/50",
        "transition-shadow resize-y min-h-[110px]",
        props.className,
      )}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl bg-input/60 border border-glass-border px-4 py-2.5 text-sm",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/50 transition-shadow",
        props.className,
      )}
    />
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl bg-input/60 border border-glass-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-card text-foreground">
          {o.label}
        </option>
      ))}
    </select>
  );
}

interface AuraButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "subtle";
  loading?: boolean;
}

export function Button({ variant = "primary", loading, className, children, disabled, ...props }: AuraButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "aura-gradient text-primary-foreground hover:shadow-[0_10px_30px_-10px_var(--color-primary)] hover:-translate-y-0.5"
      : variant === "subtle"
        ? "glass border-glass-border hover:bg-secondary/60"
        : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground";
  return (
    <button {...props} disabled={disabled || loading} className={cn(base, styles, className)}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="subtle"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* noop */
        }
      }}
    >
      {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 text-destructive-foreground px-4 py-3 text-sm">
      {message}
    </div>
  );
}

export function LoadingShimmer({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-full bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%] animate-[shimmer_1.6s_ease_infinite]"
          style={{ width: `${70 + Math.random() * 25}%` }}
        />
      ))}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>
    </div>
  );
}
