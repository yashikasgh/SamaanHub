import { ProductCard as ProductCardType } from '../../../api/types';
import { ProductCard } from './ProductCard';
import React from 'react';

interface Props {
  products: ProductCardType[];
  isLoading: boolean;
  hasMore: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export function ProductList({ products, isLoading, hasMore, fetchNextPage, isFetchingNextPage }: Props) {
  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="animate-pulse flex flex-col">
            <div className="bg-cream-100 rounded-sm aspect-[4/5] mb-4"></div>
            <div className="h-6 bg-cream-100 w-3/4 mb-2"></div>
            <div className="h-4 bg-cream-100 w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-32 text-center max-w-md mx-auto">
        <h3 className="font-serif text-2xl text-charcoal-900 mb-4 italic">No selections found</h3>
        <p className="text-charcoal-800/70 font-sans font-light leading-relaxed">
          We couldn't find any products matching your current criteria. Please try adjusting your search or exploring our curated categories.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
        {products.map((p, idx) => (
          <ProductCard key={`${p.id}-${idx}`} product={p} />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-20 flex justify-center">
          <button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-10 py-3.5 border border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900 hover:text-ivory-50 transition-colors tracking-[0.2em] text-[11px] uppercase font-sans disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Discovering...' : 'View More'}
          </button>
        </div>
      )}
    </div>
  );
}
