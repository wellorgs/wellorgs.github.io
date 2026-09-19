import { useEffect, useRef, useState } from "react";

/**
 * Keeps looping demo animations paused until the visual is actually on screen,
 * then restarts them from the first frame. Without this, the 9s loops run from
 * page load and mobile visitors arrive mid-sequence (often on an empty frame),
 * which reads as "the animation isn't working".
 */
export function AnimateInView({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);


  return (
    <div ref={ref} className={`${active ? "" : "anim-paused"} ${className}`}>
      {children}
    </div>
  );
}

export default AnimateInView;
