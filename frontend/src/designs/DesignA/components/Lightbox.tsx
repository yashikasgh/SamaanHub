import React, { useState, useEffect } from 'react';
import { ProductImage } from '../../../api/types';

export function Lightbox({ images, initialIndex, onClose }: { images: ProductImage[], initialIndex: number, onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [images.length, onClose]);

  if (!images.length) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ivory-50 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-6 right-6 text-charcoal-900 p-2 hover:text-terracotta-500 transition-colors z-10" aria-label="Close lightbox">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {images.length > 1 && (
        <button onClick={() => setIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal-900 p-4 hover:text-terracotta-500 transition-colors z-10 hidden sm:block">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
        </button>
      )}

      <div className="w-full h-full max-w-5xl max-h-[85vh] p-4 flex items-center justify-center">
        <img src={images[index].url} alt="" className="max-w-full max-h-full object-contain" />
      </div>

      {images.length > 1 && (
        <button onClick={() => setIndex(i => (i + 1) % images.length)} className="absolute right-6 top-1/2 -translate-y-1/2 text-charcoal-900 p-4 hover:text-terracotta-500 transition-colors z-10 hidden sm:block">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
      
      {images.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-charcoal-900 w-6' : 'bg-charcoal-900/30'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
