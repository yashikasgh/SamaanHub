import React, { useMemo } from 'react';
import { DesignProps } from '../Contract';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ProductList } from './components/ProductList';
import { ProductDetailView } from './components/ProductDetailView';
import { useProducts, useCategories } from '../../api/queries';
import { useLocation, Link } from 'react-router-dom';
import { ProductCard as ProductCardType } from '../../api/types';
import { ProductCard } from './components/ProductCard';

function HomeView({ storeName }: { storeName: string }) {
  const { data, isLoading } = useProducts({});
  const { data: categories } = useCategories();
  
  const featuredProducts = data?.pages[0]?.items || [];
  const uniqueCategories = categories?.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.name === c.name) === i) || [];

  return (
    <div className="bg-ivory-100">
      {/* Hero Section */}
      <section className="relative w-full h-[75vh] md:h-[85vh] bg-cream-200 overflow-hidden flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Premium Living"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-charcoal-900/20 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-ivory-50 mb-6 leading-tight italic font-medium drop-shadow-sm">
            Elevate Your Wellness, <br className="hidden md:block"/> Enhance Your Lifestyle
          </h2>
          <p className="text-ivory-50/90 font-sans font-light text-base md:text-lg mb-10 max-w-2xl mx-auto tracking-wide">
            Wellness starts with what we bring into our homes. We make it easy to enjoy natural, curated products that support a mindful, healthy lifestyle — just as nature intended.
          </p>
          <Link to="/categories/all" className="inline-block bg-ivory-50 text-charcoal-900 px-10 py-4 text-[11px] font-sans tracking-[0.2em] uppercase hover:bg-terracotta-500 hover:text-ivory-50 transition-colors rounded-sm shadow-lg">
            Explore the Collection
          </Link>
        </div>
      </section>

      {/* Brand Standard */}
      <section className="py-20 md:py-32 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-cream-200">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900 italic mb-4">The {storeName} Standard</h2>
          <p className="text-charcoal-800/70 font-sans font-light max-w-xl mx-auto">Our obsession with purity and provenance guarantees unbeatable quality, ethically sourced and carefully curated.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center mb-6 text-olive-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-serif text-xl text-charcoal-900 mb-2">100% Clean</h3>
            <p className="text-sm text-charcoal-800/60 font-sans font-light">Gorgeously good-for-you, with zero toxins or additives.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center mb-6 text-olive-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="font-serif text-xl text-charcoal-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-charcoal-800/60 font-sans font-light">Speedy delivery, straight to your door - wherever you are.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center mb-6 text-olive-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h3 className="font-serif text-xl text-charcoal-900 mb-2">Personally Curated</h3>
            <p className="text-sm text-charcoal-800/60 font-sans font-light">Hand picked and meticulously researched by our experts.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center mb-6 text-olive-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-serif text-xl text-charcoal-900 mb-2">Feel Gloriously Well</h3>
            <p className="text-sm text-charcoal-800/60 font-sans font-light">Elevate your health naturally, and glow from within.</p>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-20 md:py-32 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 border-b border-cream-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900 italic mb-3">Bestsellers</h2>
            <p className="text-charcoal-800/70 font-sans font-light">Discover our organic must-haves, packed with natural ingredients.</p>
          </div>
          <Link to="/categories/all" className="inline-block border-b border-charcoal-900 pb-1 text-xs font-sans tracking-[0.2em] uppercase text-charcoal-900 hover:text-terracotta-500 hover:border-terracotta-500 transition-colors whitespace-nowrap">
            Shop the Collection &rarr;
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex space-x-6 overflow-hidden">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-64 flex-shrink-0 h-96 bg-cream-100 animate-pulse rounded-sm"></div>)}
          </div>
        ) : (
          <div className="flex overflow-x-auto no-scrollbar space-x-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            {featuredProducts.map((p: ProductCardType) => (
              <div key={p.id} className="w-64 sm:w-72 lg:w-80 flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Curated Categories */}
      <section className="py-20 md:py-32 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900 italic mb-4">Popular Categories</h2>
          <p className="text-charcoal-800/70 font-sans font-light">Handpicked curations for your unique wellness goals.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {uniqueCategories.slice(0, 4).map((c, i) => (
            <Link key={c.id} to={`/categories/${c.slug}`} className="group block">
              <div className="aspect-[4/5] bg-cream-200 rounded-sm overflow-hidden mb-4 relative">
                <img 
                  src={`https://images.unsplash.com/photo-${['1512436991629-6a6542bea270', '1598514982205-f36b96d1e8d4', '1583338917451-fce4f15d7426', '1608248543803-ba4f8c70ae0b'][i % 4]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                  alt={c.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <h3 className="font-serif text-xl text-charcoal-900 mb-1">{c.name}</h3>
              <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-charcoal-800/60 group-hover:text-terracotta-500 transition-colors border-b border-transparent group-hover:border-terracotta-500 pb-0.5">Explore &rarr;</span>
            </Link>
          ))}
        </div>
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
      
      {/* Category Header */}
      {!q && (
        <div className="bg-cream-100 py-16 lg:py-24 mb-8">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal-900 italic mb-6 capitalize">{slug === 'all' || !slug ? 'All Products' : slug.replace(/-/g, ' ')}</h1>
            <p className="text-charcoal-800/70 font-sans font-light max-w-2xl mx-auto">
              Clean, effective products made for everyday wellness — simple ingredients, powerful results.
            </p>
          </div>
        </div>
      )}
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {q && (
          <div className="mb-12 pb-4 border-b border-cream-200">
            <h1 className="text-2xl font-serif text-charcoal-900 italic">Search results for "{q}"</h1>
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
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 font-sans flex flex-col selection:bg-terracotta-500/20">
      <Header storeName={config.store_name} />
      
      <div className="flex-grow">
        {view.type === 'home' && <HomeView storeName={config.store_name} />}
        {view.type === 'category' && <CategoryListingView slug={view.slug} />}
        {view.type === 'product' && <ProductDetailView slug={view.slug} />}
      </div>
      
      <footer className="mt-auto py-16 md:py-24 bg-olive-500 text-cream-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif italic mb-6">Thrive With Us</h3>
            <p className="font-light text-cream-100/80 mb-8 max-w-md">Join our newsletter to receive the latest updates, exclusive wellness insights, and early access to new collections.</p>
            <div className="flex">
              <input type="email" placeholder="Email Address" className="bg-ivory-50 text-charcoal-900 px-4 py-3 rounded-l-sm focus:outline-none w-full max-w-xs font-sans text-sm" />
              <button className="bg-charcoal-900 text-ivory-50 px-6 py-3 rounded-r-sm hover:bg-terracotta-500 transition-colors">&rarr;</button>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase mb-6 text-cream-100/60">Shop</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><Link to="/categories/all" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase mb-6 text-cream-100/60">Customer Care</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delivery Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-cream-100/20 text-xs font-light text-cream-100/60 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} {config.store_name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
