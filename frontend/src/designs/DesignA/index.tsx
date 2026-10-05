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

function HomeView() {
  const { data, isLoading } = useProducts({});
  const { data: categories } = useCategories();
  
  const featuredProducts = data?.pages[0]?.items || [];
  const uniqueCategories = categories?.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.name === c.name) === i) || [];

  return (
    <div className="bg-ivory-50">
      {/* Hero Section */}
      <section className="relative w-full h-auto min-h-[60vh] md:h-[80vh] bg-[#f4ebd9] overflow-hidden flex flex-col md:flex-row items-center">
        {/* Left Side Text */}
        <div className="relative z-10 w-full md:w-1/2 px-8 py-16 md:px-16 lg:px-24 flex flex-col justify-center h-full order-2 md:order-1">
          <div className="text-[#a48873] text-[10px] sm:text-xs font-sans tracking-[0.2em] uppercase mb-6 flex gap-2">
            <span>NATURAL</span> <span className="text-[#a48873]/50">|</span> <span>SUSTAINABLE</span> <span className="text-[#a48873]/50">|</span> <span>THOUGHTFUL</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#3b342f] mb-6 leading-tight font-medium">
            Everyday<br/>Essentials,<br/>Beautifully Curated.
          </h2>
          <p className="text-[#59524c] font-sans font-light text-sm md:text-base mb-10 max-w-md leading-relaxed">
            Discover a thoughtfully selected range of products for a simpler, better tomorrow.
          </p>
          <div>
            <Link to="/categories/all" className="inline-block bg-[#b87661] text-white px-8 py-4 text-xs font-sans tracking-[0.1em] hover:bg-[#a66854] transition-colors rounded-full shadow-sm">
              EXPLORE COLLECTION &rarr;
            </Link>
          </div>
        </div>
        
        {/* Right Side Image */}
        <div className="w-full md:w-1/2 h-64 md:h-full relative order-1 md:order-2">
          <img 
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Premium Living"
            className="absolute inset-0 w-full h-full object-cover object-left"
          />
        </div>
      </section>

      {/* Brand Standard */}
      <section className="py-8 md:py-12 bg-ivory-50 border-b border-cream-200">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-cream-200">
            <div className="flex flex-col md:flex-row items-center md:items-start pt-6 md:pt-0 md:pl-8 first:pl-0 gap-4">
              <div className="w-12 h-12 rounded-full border border-cream-200 flex flex-shrink-0 items-center justify-center text-charcoal-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className="font-sans font-medium text-sm text-charcoal-900 mb-1">Thoughtfully Curated</h3>
                <p className="text-xs text-charcoal-800/60 font-sans font-light">Quality products from trusted artisans.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start pt-6 md:pt-0 md:pl-8 gap-4">
              <div className="w-12 h-12 rounded-full border border-cream-200 flex flex-shrink-0 items-center justify-center text-charcoal-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="font-sans font-medium text-sm text-charcoal-900 mb-1">Sustainable Choices</h3>
                <p className="text-xs text-charcoal-800/60 font-sans font-light">Better for you and the planet.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start pt-6 md:pt-0 md:pl-8 gap-4">
              <div className="w-12 h-12 rounded-full border border-cream-200 flex flex-shrink-0 items-center justify-center text-charcoal-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div>
                <h3 className="font-sans font-medium text-sm text-charcoal-900 mb-1">Easy Enquiries</h3>
                <p className="text-xs text-charcoal-800/60 font-sans font-light">Get details via WhatsApp.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start pt-6 md:pt-0 md:pl-8 gap-4">
              <div className="w-12 h-12 rounded-full border border-cream-200 flex flex-shrink-0 items-center justify-center text-charcoal-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <div>
                <h3 className="font-sans font-medium text-sm text-charcoal-900 mb-1">Pan India Delivery</h3>
                <p className="text-xs text-charcoal-800/60 font-sans font-light">Reliable and fast.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-row items-end justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900">Featured Products</h2>
          <Link to="/categories/all" className="text-sm font-sans text-charcoal-800 hover:text-terracotta-500 transition-colors flex items-center gap-1">
            View all &rarr;
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex space-x-6 overflow-hidden">
            {[1, 2, 3, 4].map(i => <div key={i} className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 h-96 bg-cream-100 animate-pulse rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((p: ProductCardType) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Shop by Category */}
      <section className="pb-20 md:pb-32 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal-900">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {uniqueCategories.slice(0, 4).map((c, i) => (
            <Link key={c.id} to={`/categories/${c.slug}`} className="group block bg-[#f6f2ec] rounded-2xl overflow-hidden flex flex-col h-full">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={`https://images.unsplash.com/photo-${['1512436991629-6a6542bea270', '1598514982205-f36b96d1e8d4', '1583338917451-fce4f15d7426', '1608248543803-ba4f8c70ae0b'][i % 4]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                  alt={c.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-sans font-medium text-lg text-charcoal-900 mb-1">{c.name}</h3>
                  <p className="text-xs text-charcoal-800/60 font-sans font-light mb-4">Everyday essentials</p>
                </div>
                <span className="text-[10px] font-sans tracking-[0.1em] uppercase text-charcoal-800 group-hover:text-terracotta-500 transition-colors flex items-center gap-1 font-medium">EXPLORE &rarr;</span>
              </div>
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
    <div className="bg-ivory-50 min-h-screen">
      {/* Category Banner */}
      {!q && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="relative w-full h-[250px] md:h-[300px] overflow-hidden flex flex-col justify-center px-12 md:px-20 rounded-xl">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Category Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/60 to-transparent"></div>
            <div className="relative z-10 max-w-2xl text-left">
              <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 capitalize">{slug === 'all' || !slug ? 'All Products' : slug.replace(/-/g, ' ')}</h1>
              <p className="text-white/80 font-sans font-light">Beautiful essentials for a comfortable home</p>
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
                <Link to="/categories/all" className={`block py-1.5 px-3 rounded-md transition-colors ${slug === 'all' || !slug ? 'bg-[#f4ebd9] text-charcoal-900 border-l-2 border-[#b87661] font-medium' : 'text-charcoal-800 hover:bg-cream-100'}`}>
                  All
                </Link>
              </li>
              {uniqueCategories.map(c => (
                <li key={c.id}>
                  <Link to={`/categories/${c.slug}`} className={`block py-1.5 px-3 rounded-md transition-colors ${slug === c.slug ? 'bg-[#f4ebd9] text-charcoal-900 border-l-2 border-[#b87661] font-medium' : 'text-charcoal-800 hover:bg-cream-100'}`}>
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
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> In stock (42)</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> Low stock (8)</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> Out of stock (3)</label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm text-charcoal-900 font-medium mb-3">Price Range</h4>
              <div className="space-y-2 text-sm text-charcoal-800">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> ₹0 - ₹500</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> ₹500 - ₹1000</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> ₹1000 - ₹2000</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> ₹2000+</label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-sm text-charcoal-900 font-medium mb-3">Source</h4>
              <div className="space-y-2 text-sm text-charcoal-800">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> Shopify (24)</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded border-cream-200 text-[#b87661] focus:ring-[#b87661]" /> WooCommerce (29)</label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {q ? (
            <div className="mb-6 pb-4 border-b border-cream-200 flex justify-between items-center">
              <h1 className="text-2xl font-serif text-charcoal-900 italic">Search results for "{q}"</h1>
              <span className="text-sm text-charcoal-800">Showing {products.length} products</span>
            </div>
          ) : (
            <div className="mb-6 pb-4 flex justify-between items-center text-sm font-sans text-charcoal-800">
              <span>Showing <strong>{products.length}</strong> products</span>
              <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <select className="bg-transparent border border-cream-200 rounded px-2 py-1 focus:outline-none focus:border-[#b87661]">
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

export default function DesignA({ config, view }: DesignProps) {
  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 font-sans flex flex-col selection:bg-terracotta-500/20">
      <Header storeName={config.store_name} />
      
      <div className="flex-grow">
        {view.type === 'home' && <HomeView />}
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
