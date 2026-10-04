import React, { useMemo } from 'react';
import { DesignProps } from '../Contract';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ProductList } from './components/ProductList';
import { ProductDetailView } from './components/ProductDetailView';
import { useProducts, useCategories } from '../../api/queries';
import { useLocation, Link } from 'react-router-dom';
import { ProductCard } from './components/ProductCard';
import { ProductCard as ProductCardType } from '../../api/types';

function HomeView() {
  const { data, isLoading } = useProducts({});
  const { data: categories } = useCategories();
  
  const featuredProducts = data?.pages[0]?.items || [];
  const uniqueCategories = categories?.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.name === c.name) === i) || [];

  return (
    <div className="bg-ivory-50">
      {/* Immersive Edge-to-Edge Hero */}
      <section className="relative w-full h-[90vh] bg-charcoal-900 overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Immersive Gallery"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 via-transparent to-charcoal-900/40"></div>
        <div className="relative z-10 text-center px-4 mt-20 max-w-5xl">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif text-ivory-50 mb-6 leading-[1.1] font-medium drop-shadow-lg mix-blend-overlay">
            The Modern <br/> Wellness Gallery
          </h2>
          <Link to="/categories/all" className="inline-block mt-8 bg-ivory-50/10 backdrop-blur-md border border-ivory-50/30 text-ivory-50 px-12 py-4 text-[11px] font-sans tracking-[0.3em] uppercase hover:bg-ivory-50 hover:text-charcoal-900 transition-all rounded-full">
            Enter Gallery
          </Link>
        </div>
      </section>

      {/* Editorial Category Gallery */}
      <section className="py-24 bg-charcoal-900 text-ivory-50">
        <div className="max-w-[2000px] mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="text-4xl md:text-5xl font-serif font-medium leading-tight max-w-2xl">
              Curated spaces for <br/><span className="text-olive-400 italic">intentional living.</span>
            </h2>
            <p className="font-sans font-light text-ivory-50/70 max-w-md text-sm md:text-base">
              Explore our collections through a visual journey. Each piece is selected for its purity, aesthetic, and functional benefit.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {uniqueCategories.slice(0, 3).map((c, i) => (
              <Link key={c.id} to={`/categories/${c.slug}`} className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-charcoal-800 block">
                <img 
                  src={`https://images.unsplash.com/photo-${['1573164713988-8665fc963095', '1615397323281-22fb6896253c', '1586495777744-4413f21062fa'][i % 3]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                  alt={c.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <h3 className="font-serif text-3xl text-ivory-50">{c.name}</h3>
                  <span className="w-10 h-10 rounded-full border border-ivory-50/30 flex items-center justify-center group-hover:bg-ivory-50 group-hover:text-charcoal-900 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Asymmetric Product Gallery */}
      <section className="py-32 bg-ivory-50">
        <div className="text-center mb-20 px-4">
          <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-6">Gallery Highlights</h2>
          <p className="font-sans text-charcoal-800/60 tracking-widest uppercase text-xs">Exhibition 01</p>
        </div>
        
        {isLoading ? (
          <div className="max-w-[2000px] mx-auto px-4 text-center">Loading gallery...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1 px-1 lg:px-4 max-w-[2000px] mx-auto">
            {featuredProducts.slice(0, 5).map((p: ProductCardType, idx: number) => {
              let colSpan = 'md:col-span-4';
              let height = 'h-[500px]';
              let featured = false;
              
              if (idx === 0) { colSpan = 'md:col-span-8'; height = 'h-[600px] md:h-[800px]'; featured = true; }
              else if (idx === 1 || idx === 2) { colSpan = 'md:col-span-4'; height = 'h-[300px] md:h-[400px]'; }
              else if (idx === 3 || idx === 4) { colSpan = 'md:col-span-6'; height = 'h-[400px] md:h-[600px]'; }

              return (
                <div key={p.id} className={`${colSpan} ${height}`}>
                  <ProductCard product={p} featured={featured} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryListingView({ slug }: { slug?: string }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q') || undefined;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts({
    category: slug === 'all' ? undefined : slug,
    q,
  });

  const products = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.items) || [];
  }, [data]);

  return (
    <div className="bg-ivory-50 min-h-screen">
      <CategoryNav activeSlug={slug === 'all' ? undefined : slug} />
      
      {!q && (
        <div className="px-4 py-16 md:py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-charcoal-900 font-medium mb-6 capitalize">{slug === 'all' || !slug ? 'Gallery Collection' : slug.replace(/-/g, ' ')}</h1>
          <div className="w-16 h-0.5 bg-terracotta-500 mx-auto"></div>
        </div>
      )}
      
      <main className="pb-24">
        {q && (
          <div className="mb-12 px-8 py-4 border-b border-cream-200 text-center">
            <h1 className="text-3xl font-serif text-charcoal-900">Search results for "{q}"</h1>
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

export default function DesignB({ config, view }: DesignProps) {
  return (
    <div className="min-h-screen bg-ivory-50 text-charcoal-900 font-sans flex flex-col selection:bg-olive-500/30">
      <Header storeName={config.store_name} />
      
      <div className="flex-grow">
        {view.type === 'home' && <HomeView />}
        {view.type === 'category' && <CategoryListingView slug={view.slug} />}
        {view.type === 'product' && <ProductDetailView slug={view.slug} />}
      </div>
      
      <footer className="mt-auto py-20 bg-charcoal-900 text-ivory-50 border-t border-ivory-50/10">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <div className="lg:col-span-2">
            <h3 className="text-4xl font-serif mb-6 uppercase tracking-widest">{config.store_name}</h3>
            <p className="font-light text-ivory-50/60 max-w-sm mb-8 leading-relaxed">
              Curating spaces, elevating wellness. A modern gallery of functional design and natural ingredients.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase mb-8 text-ivory-50/40">Explore</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><Link to="/categories/all" className="hover:text-terracotta-400 transition-colors">Gallery All</Link></li>
              <li><Link to="/wishlist" className="hover:text-terracotta-400 transition-colors">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase mb-8 text-ivory-50/40">Connect</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><a href="#" className="hover:text-terracotta-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-terracotta-400 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-terracotta-400 transition-colors">Journal</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
