/**
 * Lazy toast facade.
 *
 * `sonner` is only needed the first time a toast is shown, so importing it
 * dynamically keeps it off the initial hydration path (it was one of the
 * largest bootup costs on the landing page).
 */
type ToastArgs = Parameters<typeof import("sonner").toast>;
type ToastOptions = ToastArgs[1];

async function call(kind: "message" | "success" | "error" | "info" | "warning", message: string, options?: ToastOptions) {
  const mod = await import("sonner");
  if (kind === "message") return mod.toast(message, options);
  return mod.toast[kind](message, options);
}

export const toast = Object.assign(
  (message: string, options?: ToastOptions) => void call("message", message, options),
  {
    success: (message: string, options?: ToastOptions) => void call("success", message, options),
    error: (message: string, options?: ToastOptions) => void call("error", message, options),
    info: (message: string, options?: ToastOptions) => void call("info", message, options),
    warning: (message: string, options?: ToastOptions) => void call("warning", message, options),
  },
);
