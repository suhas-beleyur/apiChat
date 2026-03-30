import { useRef } from "react";

/**
 * Provides a ref and a trigger function that auto-resizes a textarea
 * based on its content, up to a given max height (default 180px).
 */
export function useAutoResize(maxHeight = 180) {
  const ref = useRef(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  };

  const reset = () => {
    if (ref.current) ref.current.style.height = "auto";
  };

  return { ref, resize, reset };
}
