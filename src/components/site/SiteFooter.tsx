export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-5">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
        <p className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold text-primary-foreground">
            M
          </span>
          <span>© {new Date().getFullYear()} Assisty AI. Someone should always pick up.</span>
        </p>
        <a
          href="mailto:hello@myassistant.app"
          className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary transition-colors hover:bg-primary/15 hover:text-primary"
        >
          hello@myassistant.app
        </a>
      </div>
    </footer>
  );
}

