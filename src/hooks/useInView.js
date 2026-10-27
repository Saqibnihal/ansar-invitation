import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for intersection observer based scroll animations
 * @param {object} options - IntersectionObserver options
 * @returns {[ref, boolean]} - [elementRef, isInView]
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (!options.repeat) {
            observer.unobserve(element);
          }
        } else if (options.repeat) {
          setIsInView(false);
        }
      },
      {
        threshold: options.threshold || 0.2,
        rootMargin: options.rootMargin || '0px',
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.repeat]);

  return [ref, isInView];
}
