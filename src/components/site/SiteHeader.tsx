import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SECTIONS = [
  { id: "screens", label: "The app" },
  { id: "features", label: "Features" },
  { id: "who", label: "Who it's for" },
  // PRICING HIDDEN - restore these two nav links with the section
  // { id: "pricing", label: "Pricing" },
  // { id: "nri", label: "Teams abroad" },
  { id: "trust", label: "Trust and safety" },
  { id: "faq", label: "FAQ" },
  { id: "board", label: "Feature board" },
] as const;


export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onLanding = pathname === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Close the menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Scroll spy — highlights the section currently in view
  useEffect(() => {
    if (!onLanding || typeof IntersectionObserver === "undefined") return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onLanding]);

  const go = useCallback(
    (id: string) => (e: React.MouseEvent) => {
      const el = document.getElementById(id);
      if (!el) return; // let the browser handle it (e.g. cross-page hash)
      e.preventDefault();
      setOpen(false);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-5">
        <Link
          to="/"
          aria-label="Assisty AI home"
          onClick={() => {
            setOpen(false);
            if (onLanding) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              history.replaceState(null, "", "/");
            }
          }}
          className="flex min-w-0 items-center gap-2.5"
        >
          <img src="/logo-lockup.png" alt="Assisty AI" className="h-10 w-auto max-w-none shrink-0 sm:h-[52px]" />
        </Link>

        {/* Section nav — desktop */}
        <nav className="hidden items-center gap-0.5 text-sm lg:flex" aria-label="Sections">
          {SECTIONS.map((s) =>
            s.id === "board" ? (
              <Link
                key={s.id}
                to="/features"
                className="whitespace-nowrap rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeProps={{ className: "text-foreground bg-muted" }}
              >
                {s.label}
              </Link>
            ) : (
              <a
                key={s.id}
                href={onLanding ? `#${s.id}` : `/#${s.id}`}
                onClick={onLanding ? go(s.id) : undefined}
                aria-current={active === s.id ? "true" : undefined}
                className={`whitespace-nowrap rounded-full px-3 py-2 transition-colors hover:bg-muted hover:text-foreground ${
                  active === s.id ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 text-[13px] sm:text-sm">
          <Link
            to="/features"
            className="whitespace-nowrap rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            activeProps={{ className: "text-foreground bg-muted" }}
          >
            Board
          </Link>
          <a
            href={onLanding ? "#waitlist" : "/#waitlist"}
            onClick={onLanding ? go("waitlist") : undefined}
            className="btn-glow whitespace-nowrap rounded-full bg-foreground px-3.5 py-2 font-medium text-background sm:px-4"
          >
            <span className="sm:hidden">Join</span>
            <span className="hidden sm:inline">Get early access</span>
          </a>

          {/* Hamburger — mobile / tablet */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-soft transition-colors hover:bg-muted lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-30 cursor-default bg-foreground/20 backdrop-blur-[2px] lg:hidden"
          />
          <div
            id="site-menu"
            className="seq-in absolute inset-x-0 top-16 z-40 border-b border-border/60 bg-background px-4 pb-5 pt-3 shadow-lift lg:hidden"
          >
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Explore
            </p>
            <nav className="grid gap-1" aria-label="Sections">
              {SECTIONS.map((s) =>
                s.id === "board" ? (
                  <Link
                    key={s.id}
                    to="/features"
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-3 py-3 text-[15px] font-medium text-foreground/80 transition-colors hover:bg-muted"
                  >
                    {s.label}
                  </Link>
                ) : (
                  <a
                    key={s.id}
                    href={onLanding ? `#${s.id}` : `/#${s.id}`}
                    onClick={onLanding ? go(s.id) : () => setOpen(false)}
                    className={`rounded-2xl px-3 py-3 text-[15px] font-medium transition-colors hover:bg-muted ${
                      active === s.id ? "bg-muted text-foreground" : "text-foreground/80"
                    }`}
                  >
                    {s.label}
                  </a>
                ),
              )}
            </nav>
            <a
              href={onLanding ? "#waitlist" : "/#waitlist"}
              onClick={onLanding ? go("waitlist") : () => setOpen(false)}
              className="mt-3 flex h-12 items-center justify-center rounded-2xl bg-foreground text-[15px] font-semibold text-background"
            >
              Join the waitlist
            </a>
          </div>
        </>
      )}
    </header>
  );
}
