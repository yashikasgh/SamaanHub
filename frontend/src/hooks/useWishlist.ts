import { useState, useEffect } from 'react';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('catalog_wishlist');
      if (stored) setWishlist(JSON.parse(stored));
    } catch {
      // Ignored
    }
  }, []);

  const toggle = (id: string) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('catalog_wishlist', JSON.stringify(next));
      // Dispatch a custom event so other components can sync state without a heavy context
      window.dispatchEvent(new Event('wishlist_updated'));
      return next;
    });
  };

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('catalog_wishlist');
        if (stored) setWishlist(JSON.parse(stored));
      } catch {}
    };
    window.addEventListener('wishlist_updated', handleUpdate);
    return () => window.removeEventListener('wishlist_updated', handleUpdate);
  }, []);

  return { wishlist, toggle };
}
