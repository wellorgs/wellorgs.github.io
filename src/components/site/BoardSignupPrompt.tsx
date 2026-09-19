import { useEffect, useState } from "react";
import { Bell, Check, } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WaitlistForm } from "@/components/site/WaitlistForm";
import { setPlanIntent } from "@/lib/plan-intent";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "myfamily.waitlist.email";

/** True once this browser has joined the waitlist. */
export function hasJoinedWaitlist() {
  try {
    return !!window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

/** Live joined state, re-checked whenever the dialog closes. */
export function useJoinedWaitlist(revision: number) {
  const [joined, setJoined] = useState(false);
  useEffect(() => {
    setJoined(hasJoinedWaitlist());
  }, [revision]);
  return joined;
}

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** What the visitor just did, used in the headline. */
  reason: "vote" | "idea";
};

export function BoardSignupDialog({ open, onOpenChange, reason }: DialogProps) {
  useEffect(() => {
    if (open) setPlanIntent("Feature board");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-tint-green px-3 py-1 text-xs font-semibold">
            <Check className="size-3.5" strokeWidth={3} />
            {reason === "vote" ? "Vote counted" : "Idea posted"}
          </span>
          <DialogTitle className="mt-3 text-2xl font-semibold tracking-tight">
            Want to know when this gets built?
          </DialogTitle>
          <DialogDescription className="text-[15px] leading-relaxed">
            Votes are anonymous, so we cannot tell you when your request ships unless
            you leave an email. Add yours and we will tell you the day it goes live.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-[15px] text-muted-foreground">
          <li className="flex gap-2">
            <Bell className="mt-0.5 size-4 shrink-0 text-foreground/70" />
            An email when the feature you voted for ships
          </li>
        </ul>

        <WaitlistForm compact />

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="mx-auto text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Maybe later
        </button>
      </DialogContent>
    </Dialog>
  );
}

/** Inline card that sits on the board for visitors who have not joined yet. */
export function BoardSignupCard({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "rounded-xl bg-card p-6 sm:p-7",
        className,
      )}
    >
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        Voting is anonymous. Leave your email so we can tell you when it ships.
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
        We do not track who voted for what. An email is the only way we can reach you
        when your request goes live.
      </p>
      <WaitlistForm compact className="mt-4" />
    </section>
  );
}
