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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="animate-pulse flex flex-col bg-stone-100 rounded-sm aspect-[3/4]"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-stone-500 font-serif text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {products.map((p, idx) => (
          <ProductCard key={`${p.id}-${idx}`} product={p} />
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-8 py-3 border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors tracking-widest text-sm uppercase font-sans disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
