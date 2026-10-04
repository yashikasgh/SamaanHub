import React, { useMemo } from 'react';
import { DesignProps } from '../Contract';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ProductList } from './components/ProductList';
import { ProductDetailView } from './components/ProductDetailView';
import { useProducts } from '../../api/queries';
import { useLocation } from 'react-router-dom';

function HomeCategoryView({ slug }: { slug?: string }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q') || undefined;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts({
    category: slug,
    q,
  });

  const products = useMemo(() => {
    return data?.pages.flatMap(page => page.items) || [];
  }, [data]);

  return (
    <div>
      <CategoryNav activeSlug={slug} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {q && (
          <div className="mb-8 pb-4 border-b border-stone-200">
            <h2 className="text-xl font-serif text-stone-800">Search results for "{q}"</h2>
          </div>
        )}
        
        <ProductList 
          products={products} 
          isLoading={isLoading} 
          hasMore={!!hasNextPage} 
          fetchNextPage={fetchNextPage} 
          isFetchingNextPage={isFetchingNextPage} 
        />
      </main>
    </div>
  );
}

export default function DesignA({ config, view }: DesignProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col">
      <Header storeName={config.store_name} />
      
      <div className="flex-grow">
        {view.type === 'home' && <HomeCategoryView />}
        {view.type === 'category' && <HomeCategoryView slug={view.slug} />}
        {view.type === 'product' && <ProductDetailView slug={view.slug} />}
      </div>
      
      <footer className="mt-auto py-12 border-t border-stone-200 bg-white text-center">
        <p className="text-stone-500 text-sm font-sans tracking-widest uppercase">
          &copy; {new Date().getFullYear()} {config.store_name}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
