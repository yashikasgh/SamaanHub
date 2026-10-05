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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-1 px-1">
        <div className="md:col-span-8 aspect-square md:aspect-auto md:h-[600px] bg-cream-200 animate-pulse"></div>
        <div className="md:col-span-4 aspect-square md:aspect-auto md:h-[600px] bg-cream-100 animate-pulse"></div>
        <div className="md:col-span-4 aspect-square md:aspect-auto md:h-[400px] bg-cream-100 animate-pulse"></div>
        <div className="md:col-span-4 aspect-square md:aspect-auto md:h-[400px] bg-cream-200 animate-pulse"></div>
        <div className="md:col-span-4 aspect-square md:aspect-auto md:h-[400px] bg-cream-100 animate-pulse"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-40 text-center max-w-lg mx-auto px-4">
        <h3 className="font-serif text-3xl text-charcoal-900 mb-6 font-medium">Nothing found in the gallery</h3>
        <p className="text-charcoal-800/70 font-sans font-light leading-relaxed">
          The collection you are looking for currently has no items. Please explore other curated spaces in our catalog.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-1 px-1 lg:px-4 max-w-[2000px] mx-auto">
        {products.map((p, idx) => {
          // Asymmetric pattern: 8+4, 4+4+4, 6+6, repeat
          let colSpan = 'md:col-span-4';
          let height = 'h-[400px] md:h-[500px]';
          let featured = false;
          
          const patternIdx = idx % 7;
          if (patternIdx === 0) { colSpan = 'md:col-span-8'; height = 'h-[500px] md:h-[700px]'; featured = true; }
          else if (patternIdx === 1) { colSpan = 'md:col-span-4'; height = 'h-[500px] md:h-[700px]'; }
          else if (patternIdx >= 2 && patternIdx <= 4) { colSpan = 'md:col-span-4'; height = 'h-[400px] md:h-[450px]'; }
          else if (patternIdx >= 5) { colSpan = 'md:col-span-6'; height = 'h-[400px] md:h-[600px]'; }

          return (
            <div key={`${p.id}-${idx}`} className={`${colSpan} ${height}`}>
              <ProductCard product={p} />
            </div>
          );
        })}
      </div>
      
      {hasMore && (
        <div className="mt-24 mb-12 flex justify-center">
          <button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-12 py-4 bg-charcoal-900 text-ivory-50 hover:bg-terracotta-500 transition-colors tracking-[0.2em] text-[11px] uppercase font-sans disabled:opacity-50 rounded-sm shadow-xl"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More Gallery'}
          </button>
        </div>
      )}
    </div>
  );
}
