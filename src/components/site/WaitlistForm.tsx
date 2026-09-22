import { useEffect, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { checkEmailDomain } from "@/lib/email-domains";
import { cleanName, cleanPhone } from "@/lib/waitlist-validation";
import { checkWaitlist, joinWaitlist } from "@/lib/waitlist.functions";
import { clearPlanIntent, getPlanIntent, onPlanIntentChange } from "@/lib/plan-intent";
import { captureTrafficSource, getTrafficSource } from "@/lib/traffic-source";

type Props = { className?: string; compact?: boolean; onPrimary?: boolean };
type Field = "name" | "phone" | "email";

const STORAGE_KEY = "assistyai.waitlist.email";
const LAST_TRY_KEY = "assistyai.waitlist.lastTry";
/** Client-side cooldown between attempts (server enforces the real limit). */
const COOLDOWN_MS = 15_000;

const validateName = (v: string) =>
  !v.trim() ? "Name is required" : cleanName(v) ? undefined : "Use English letters only (2 to 80 characters)";
const validatePhone = (v: string) =>
  v.trim() && !cleanPhone(v) ? "Enter a valid phone number, like +91 98123 45678, or leave it blank" : undefined;
const validateEmail = (v: string) => {
  if (!v.trim()) return "Email is required";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return "Enter a valid email address, like you@company.com";
  const d = checkEmailDomain(v);
  return d.ok ? undefined : d.message;
};

export function WaitlistForm({ className, compact, onPrimary }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [company, setCompany] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string | undefined>>>({});
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [plan, setPlan] = useState("");
  const mountedAt = useRef(Date.now());
  const join = useServerFn(joinWaitlist);
  const check = useServerFn(checkWaitlist);

  const setFieldError = (field: Field, message?: string) =>
    setFieldErrors((prev) => ({ ...prev, [field]: message }));

  // Pick up the plan a visitor tapped on the pricing cards.
  useEffect(() => {
    setPlan(getPlanIntent());
    return onPlanIntentChange(setPlan);
  }, []);

  // Note which link (utm_source, or the referring site) first brought this visitor in.
  useEffect(() => {
    captureTrafficSource();
  }, []);

  // Restore confirmed state after a refresh, verified against the database.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    let active = true;
    check({ data: { email: saved } })
      .then((res) => {
        if (!active) return;
        if (res.joined) {
          setEmail(saved);
          setState("done");
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [check]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = { name: validateName(name), phone: validatePhone(phone), email: validateEmail(email) };
    setFieldErrors(next);
    if (next.name || next.phone || next.email) {
      setError(null);
      toast.error("Please fix the highlighted fields");
      return;
    }

    const last = Number(window.localStorage.getItem(LAST_TRY_KEY) ?? 0);
    if (Date.now() - last < COOLDOWN_MS) {
      setError("Please wait a few seconds before trying again.");
      toast.error("Please wait a few seconds before trying again");
      return;
    }
    window.localStorage.setItem(LAST_TRY_KEY, String(Date.now()));

    setError(null);
    setState("loading");
    try {
      const res = await join({
        data: {
          email,
          name: name.trim(),
          phone: phone.trim(),
          plan,
          source: getTrafficSource(),
          company,
          elapsedMs: Date.now() - mountedAt.current,
        },
      });
      window.localStorage.setItem(STORAGE_KEY, res.email);
      setEmail(res.email);
      setAlreadyJoined(res.alreadyJoined);
      setState("done");
      if (!res.alreadyJoined) {
        // Mark the conversion for Clarity's funnels/filters. Best-effort: never blocks the signup.
        (window as unknown as { clarity?: (...a: unknown[]) => void }).clarity?.("event", "early_access_requested");
      }
      toast.success(res.alreadyJoined ? "You're already on the list" : "You're on the list", {
        description: "We'll email you when early access opens.",
      });
    } catch (err) {
      setState("idle");
      const message = err instanceof Error ? err.message : "";
      if (/too many attempts/i.test(message)) {
        setError("Too many attempts. Please try again in a few minutes.");
        toast.error("Too many attempts", {
          description: "Please try again in a few minutes.",
        });
      } else if (/permanent email/i.test(message)) {
        setFieldError("email", "Please use a permanent email address. Disposable inboxes cannot receive your invite.");
        toast.error("Please use a permanent email address", {
          description: "Disposable inboxes can't receive your invite.",
        });
      } else if (message.startsWith("INPUT:")) {
        const text = message.slice(6);
        setFieldError(/phone/i.test(text) ? "phone" : /name/i.test(text) ? "name" : "email", text);
        toast.error(text);
      } else if (/verified email domain|did you mean/i.test(message)) {
        setFieldError("email", message);
        toast.error("Use a verified email domain", { description: message });
      } else {
        console.error(err);
        setError("Something went wrong. Please try again in a moment.");
        toast.error("Something went wrong", {
          description: "Please try again in a moment.",
        });
      }
    }
  };

  if (state === "done") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl bg-tint-green px-5 py-4 text-left",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success/15">
          <Check className="size-5 text-success" strokeWidth={2.4} />
        </span>
        <div>
          <p className="text-sm font-semibold">
            {alreadyJoined ? "You're already on the list" : "You're on the list"}
          </p>
          <p className="text-sm text-muted-foreground">
            Spot reserved for {email}. It's invite-only for now, we're onboarding in small batches.
          </p>
        </div>
      </div>
    );
  }

  const fieldClass = cn(
    "h-14 rounded-2xl border-border bg-card px-5 text-base placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring",
    compact && "h-13",
  );
  const invalidClass = onPrimary
    ? "border-primary-foreground ring-2 ring-primary-foreground"
    : "border-destructive ring-1 ring-destructive";
  const errorText = cn(
    "px-1 text-left text-sm font-medium",
    onPrimary ? "text-primary-foreground" : "text-destructive",
  );

  return (
    <form noValidate onSubmit={onSubmit} className={cn("flex w-full flex-col gap-2.5", className)}>
      {/* Honeypot: hidden from people, tempting to bots */}
      <input
        type="text"
        name="company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] size-0 opacity-0"
      />
      {plan && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full bg-muted px-3 py-1 font-medium text-foreground">
            Interested in: {plan}
          </span>
          <button
            type="button"
            onClick={clearPlanIntent}
            className="underline underline-offset-4 hover:text-foreground"
          >
            Remove
          </button>
        </div>
      )}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
        <div className="flex flex-1 flex-col gap-1.5">
          <Input
            type="text"
            maxLength={80}
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldErrors.name)}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldError("name", undefined);
            }}
            onBlur={() => name && setFieldError("name", validateName(name))}
            placeholder="Your name *"
            aria-label="Your name, required"
            className={cn(fieldClass, fieldErrors.name && invalidClass)}
          />
          {fieldErrors.name && (
            <p role="alert" className={errorText}>
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <Input
            type="tel"
            maxLength={30}
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(fieldErrors.phone)}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) setFieldError("phone", undefined);
            }}
            onBlur={() => setFieldError("phone", validatePhone(phone))}
            placeholder="Phone (optional)"
            aria-label="Phone number, optional"
            className={cn(fieldClass, fieldErrors.phone && invalidClass)}
          />
          {fieldErrors.phone && (
            <p role="alert" className={errorText}>
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
        <div className="flex flex-1 flex-col gap-1.5">
          <Input
            type="email"
            maxLength={254}
            inputMode="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldErrors.email)}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) setFieldError("email", undefined);
            }}
            onBlur={() => email && setFieldError("email", validateEmail(email))}
            placeholder="you@email.com *"
            aria-label="Email address, required"
            className={cn(fieldClass, fieldErrors.email && invalidClass)}
          />
          {fieldErrors.email && (
            <p role="alert" className={errorText}>
              {fieldErrors.email}
            </p>
          )}
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={state === "loading"}
          className={cn(
            "h-14 rounded-2xl px-7 text-base font-semibold",
            onPrimary
              ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              : "bg-foreground text-background hover:bg-foreground/90",
          )}
        >
          {state === "loading" ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Request Early Access"
          )}
        </Button>
      </div>
      <p className={cn("px-1 text-xs", onPrimary ? "text-primary-foreground/80" : "text-muted-foreground")}>
        * Required
      </p>
      {error ? (
        <p
          role="alert"
          aria-live="assertive"
          className={cn(
            "px-1 text-sm font-medium",
            onPrimary ? "text-primary-foreground/90" : "text-destructive",
          )}
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
