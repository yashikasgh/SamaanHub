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
    <div className="bg-[#f6ebd8]">
      {/* Immersive Edge-to-Edge Hero */}
      <section className="relative w-full max-w-[1440px] mx-auto pt-6 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-4 h-auto lg:h-[80vh]">
        {/* Left Large Hero Area */}
        <div className="relative w-full lg:w-2/3 h-[60vh] lg:h-full rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Immersive Gallery"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/60 to-transparent"></div>
          <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-12 lg:p-16">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-4 leading-[1.1] font-medium">
              Thoughtful<br/>Products<br/>for a Better<br/>Everyday
            </h2>
            <p className="text-white/90 font-sans font-light text-sm max-w-sm mb-8">
              Curated essentials for a home, a healthier lifestyle, and a more sustainable tomorrow.
            </p>
            <div>
              <Link to="/categories/all" className="inline-block bg-[#b87661] text-white px-8 py-3 text-[11px] font-sans tracking-[0.1em] uppercase hover:bg-[#a66854] transition-all rounded-full">
                EXPLORE COLLECTION &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Stacked Tiles */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full">
          {uniqueCategories.slice(0, 3).map((c, i) => (
            <Link key={c.id} to={`/categories/${c.slug}`} className="relative flex-1 rounded-2xl overflow-hidden group">
              <img 
                src={`https://images.unsplash.com/photo-${['1573164713988-8665fc963095', '1615397323281-22fb6896253c', '1586495777744-4413f21062fa'][i % 3]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                alt={c.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal-900/40 transition-colors group-hover:bg-charcoal-900/50"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-center">
                <h3 className="font-serif text-2xl lg:text-3xl text-white mb-2">{c.name}</h3>
                <p className="text-white/80 text-xs font-light font-sans mb-4">Everyday wellness essentials</p>
                <span className="text-white text-[10px] uppercase tracking-widest font-medium">Explore &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collections Pills */}
      <section className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-serif text-charcoal-900">Featured Collections</h2>
          <Link to="/categories/all" className="text-xs font-sans text-charcoal-800 hover:text-[#b87661] uppercase tracking-wider">View all &rarr;</Link>
        </div>
        <div className="flex overflow-x-auto gap-4 no-scrollbar pb-4">
          {uniqueCategories.slice(0, 5).map((c, i) => (
            <Link key={c.id} to={`/categories/${c.slug}`} className="flex-shrink-0 relative w-64 h-32 rounded-2xl overflow-hidden group block">
              <img 
                src={`https://images.unsplash.com/photo-${['1512436991629-6a6542bea270', '1598514982205-f36b96d1e8d4', '1583338917451-fce4f15d7426', '1608248543803-ba4f8c70ae0b', '1596462502278-27bfdc403348'][i % 5]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                alt={c.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-charcoal-900/30"></div>
              <div className="absolute inset-0 p-4 flex items-end justify-between">
                <span className="text-white font-sans font-medium">{c.name}</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-8 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-serif text-charcoal-900 mb-1">Bestsellers</h2>
          <p className="text-xs text-charcoal-800/60 font-sans">Curated favourites loved by our customers</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-80 bg-[#e8e3d9] animate-pulse rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((p: ProductCardType) => (
              <div key={p.id} className="h-full">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Full Width Banner */}
      <section className="py-16 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Natural Materials"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-900/30"></div>
          <div className="relative z-10 px-8 md:px-16 lg:px-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Natural Materials.<br/>Real Change.</h2>
            <p className="text-white/90 font-sans font-light max-w-sm mb-8 text-sm">Sustainable, durable and timeless products for a conscious lifestyle.</p>
            <Link to="/categories/all" className="inline-block bg-[#b87661] text-white px-8 py-3 text-[11px] font-sans tracking-[0.1em] uppercase hover:bg-[#a66854] transition-all rounded-full">
              EXPLORE SUSTAINABLE PICKS &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryListingView({ slug }: { slug?: string }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q') || undefined;

  const { data: categoriesData } = useCategories();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts({
    category: slug === 'all' ? undefined : slug,
    q,
  });

  const products = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.items) || [];
  }, [data]);

  const uniqueCategories = categoriesData?.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.name === c.name) === i) || [];

  return (
    <div className="bg-[#f6ebd8] min-h-screen">
      {!q && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="relative w-full h-[250px] md:h-[300px] overflow-hidden flex flex-col justify-center px-12 md:px-20 rounded-2xl">
            <img 
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Category Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-charcoal-900/40"></div>
            <div className="relative z-10 max-w-2xl text-left">
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 capitalize">{slug === 'all' || !slug ? 'All Products' : slug.replace(/-/g, ' ')}</h1>
              <p className="text-white/80 font-sans font-light">Explore a beautiful range of products to make your space comfortable and inspiring.</p>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 font-sans">
          <div className="mb-8">
            <h3 className="font-medium text-sm text-charcoal-900 mb-4">Categories</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link to="/categories/all" className={`block py-1.5 px-3 rounded-md transition-colors ${slug === 'all' || !slug ? 'bg-[#e8e3d9] text-charcoal-900 border-l-2 border-[#b87661] font-medium' : 'text-charcoal-800 hover:bg-[#e8e3d9]/50'}`}>
                  All
                </Link>
              </li>
              {uniqueCategories.map(c => (
                <li key={c.id}>
                  <Link to={`/categories/${c.slug}`} className={`block py-1.5 px-3 rounded-md transition-colors ${slug === c.slug ? 'bg-[#e8e3d9] text-charcoal-900 border-l-2 border-[#b87661] font-medium' : 'text-charcoal-800 hover:bg-[#e8e3d9]/50'}`}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="font-medium text-sm text-charcoal-900 mb-4">Filters</h3>
            
            <div className="mb-6">
              <h4 className="text-sm text-charcoal-900 font-medium mb-3">Availability</h4>
              <div className="space-y-2 text-sm text-charcoal-800">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-[#e8e3d9] text-[#b87661] focus:ring-[#b87661]" /> In stock (42)</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-[#e8e3d9] text-[#b87661] focus:ring-[#b87661]" /> Low stock (8)</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-[#e8e3d9] text-[#b87661] focus:ring-[#b87661]" /> Out of stock (3)</label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm text-charcoal-900 font-medium mb-3">Price Range</h4>
              <div className="space-y-2 text-sm text-charcoal-800">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-[#e8e3d9] text-[#b87661] focus:ring-[#b87661]" /> ₹0 - ₹500</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-[#e8e3d9] text-[#b87661] focus:ring-[#b87661]" /> ₹500 - ₹1000</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-[#e8e3d9] text-[#b87661] focus:ring-[#b87661]" /> ₹1000 - ₹2000</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-[#e8e3d9] text-[#b87661] focus:ring-[#b87661]" /> ₹2000+</label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {q ? (
            <div className="mb-6 pb-4 border-b border-[#e8e3d9] flex justify-between items-center">
              <h1 className="text-2xl font-serif text-charcoal-900 italic">Search results for "{q}"</h1>
              <span className="text-sm text-charcoal-800">Showing {products.length} products</span>
            </div>
          ) : (
            <div className="mb-6 pb-4 flex justify-between items-center text-sm font-sans text-charcoal-800">
              <span>Showing <strong>{products.length}</strong> products</span>
              <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <select className="bg-transparent border border-[#e8e3d9] rounded px-2 py-1 focus:outline-none focus:border-[#b87661]">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          )}
          
          <ProductList 
            products={products} 
            isLoading={isLoading} 
            hasMore={!!hasNextPage} 
            fetchNextPage={fetchNextPage} 
            isFetchingNextPage={isFetchingNextPage} 
          />
        </div>
      </main>
    </div>
  );
}

export default function DesignB({ config, view }: DesignProps) {
  return (
    <div className="min-h-screen bg-[#f6ebd8] text-charcoal-900 font-sans flex flex-col selection:bg-[#a48873]/30">
      <Header storeName={config.store_name} />
      
      <div className="flex-grow">
        {view.type === 'home' && <HomeView />}
        {view.type === 'category' && <CategoryListingView slug={view.slug} />}
        {view.type === 'product' && <ProductDetailView slug={view.slug} />}
      </div>
      
      <footer className="mt-auto py-20 bg-[#3b342f] text-[#f6ebd8] border-t border-[#3b342f]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-serif mb-6">{config.store_name}</h3>
            <p className="font-light text-[#f6ebd8]/60 max-w-sm mb-8 leading-relaxed text-sm">
              Curating spaces, elevating wellness. A modern gallery of functional design and natural ingredients.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase mb-6 text-[#f6ebd8]/50">Explore</h4>
            <ul className="space-y-3 font-light text-sm text-[#f6ebd8]/80">
              <li><Link to="/categories/all" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase mb-6 text-[#f6ebd8]/50">Connect</h4>
            <ul className="space-y-3 font-light text-sm text-[#f6ebd8]/80">
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
