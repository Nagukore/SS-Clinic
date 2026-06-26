import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// On route change: scroll to the #hash target if present, otherwise to the top.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a tick so the target element is mounted.
      const id = hash.replace('#', '');
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        window.scrollTo({ top: 0 });
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [pathname, hash]);

  return null;
}
