import { useState, useEffect } from 'react';

export function useEnquiry() {
  const [enquiry, setEnquiry] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('catalog_enquiry');
      if (stored) setEnquiry(JSON.parse(stored));
    } catch {
      // Ignored
    }
  }, []);

  const toggle = (id: string) => {
    setEnquiry(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('catalog_enquiry', JSON.stringify(next));
      window.dispatchEvent(new Event('enquiry_updated'));
      return next;
    });
  };

  const clear = () => {
    setEnquiry([]);
    localStorage.removeItem('catalog_enquiry');
    window.dispatchEvent(new Event('enquiry_updated'));
  };

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('catalog_enquiry');
        if (stored) setEnquiry(JSON.parse(stored));
      } catch {}
    };
    window.addEventListener('enquiry_updated', handleUpdate);
    return () => window.removeEventListener('enquiry_updated', handleUpdate);
  }, []);

  return { enquiry, toggle, clear };
}
