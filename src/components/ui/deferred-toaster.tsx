import { lazy, Suspense, useEffect, useState } from "react";

const SonnerToaster = lazy(() =>
  import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })),
);

/**
 * Mounts the toaster only after the browser is idle, so the toast library
 * never competes with hydration of the visible page.
 */
export function DeferredToaster(props: React.ComponentProps<typeof SonnerToaster>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const useIdle = typeof w.requestIdleCallback === "function";
    const id = useIdle
      ? w.requestIdleCallback!(() => setReady(true), { timeout: 2500 })
      : window.setTimeout(() => setReady(true), 1200);
    return () => {
      if (useIdle) w.cancelIdleCallback?.(id);
      else clearTimeout(id);
    };
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <SonnerToaster {...props} />
    </Suspense>
  );
}
