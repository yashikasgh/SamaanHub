import React from 'react';
import { useProduct, useRelatedProducts } from '../../../api/queries';
import { ProductList } from './ProductList';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEnquiry } from '../../../hooks/useEnquiry';

export function ProductDetailView({ slug }: { slug: string }) {
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: related } = useRelatedProducts(slug);
  
  const { wishlist, toggle: toggleWishlist } = useWishlist();
  const { enquiry, toggle: toggleEnquiry } = useEnquiry();

  if (isLoading) {
    return <div className="max-w-[2000px] mx-auto px-4 py-24 animate-pulse flex flex-col lg:flex-row gap-12"><div className="w-full lg:w-2/3 h-screen bg-cream-100"></div><div className="w-full lg:w-1/3 space-y-6 mt-12"><div className="h-12 bg-cream-100 w-3/4"></div><div className="h-6 bg-cream-100 w-1/4"></div></div></div>;
  }

  if (error || !product) {
    return <div className="py-40 text-center text-charcoal-500 font-serif text-3xl">Piece not found in gallery.</div>;
  }

  const isWishlisted = wishlist.includes(product.id);
  const isEnquired = enquiry.includes(product.id);
  const outOfStock = product.availability !== 'in_stock';

  return (
    <div className="bg-ivory-50 pb-32">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 pt-6">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
          
          {/* Vertical Image Stack - Left Side (2/3 width) */}
          <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col gap-4 pt-12">
            {product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <div key={idx} className="w-full bg-cream-100 relative group overflow-hidden">
                  <img 
                    src={img.url} 
                    alt={img.alt || product.name}
                    className="w-full h-auto min-h-[60vh] object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))
            ) : (
              <div className="w-full aspect-square flex items-center justify-center text-charcoal-800/40 font-serif italic bg-cream-200 text-2xl">
                Visual not available
              </div>
            )}
          </div>

          {/* Sticky Info Panel - Right Side (1/3 width) */}
          <div className="w-full lg:w-[40%] xl:w-[35%] relative">
            <div className="lg:sticky lg:top-32 lg:pb-32 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar pt-12">
              
              <div className="mb-6 flex justify-between items-center">
                <div className="text-[10px] font-sans tracking-[0.3em] uppercase text-terracotta-500">
                  {product.categories.map(c => c.name).join(' — ')}
                </div>
                {outOfStock && (
                  <span className="bg-charcoal-900 text-ivory-50 px-2.5 py-1 text-[9px] uppercase tracking-widest">Sold Out</span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-serif text-charcoal-900 leading-[1.1] mb-8">
                {product.name}
              </h1>

              <div className="text-2xl text-charcoal-800 font-sans tracking-widest mb-12 font-light">
                {product.price !== null ? (
                  <span>{product.currency} {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                ) : (
                  <span>Price on Request</span>
                )}
              </div>
              
              <div className="flex flex-col gap-4 mb-16">
                <button
                  onClick={() => toggleEnquiry(product.id)}
                  disabled={outOfStock && !isEnquired}
                  className={`w-full py-5 text-[11px] font-sans tracking-[0.3em] uppercase transition-all rounded-sm shadow-xl ${
                    isEnquired 
                      ? 'bg-olive-500 text-ivory-50 border border-olive-500' 
                      : outOfStock 
                        ? 'bg-transparent text-charcoal-800/40 cursor-not-allowed border border-charcoal-900/20'
                        : 'bg-charcoal-900 text-ivory-50 hover:bg-terracotta-500 hover:border-terracotta-500 border border-charcoal-900'
                  }`}
                >
                  {isEnquired ? 'Added to Enquiry' : 'Enquire'}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-full py-4 text-[11px] font-sans tracking-[0.3em] uppercase transition-colors border ${
                    isWishlisted 
                      ? 'border-terracotta-500 text-terracotta-500 bg-transparent' 
                      : 'border-charcoal-900/20 text-charcoal-900 hover:border-charcoal-900'
                  }`}
                >
                  {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="mb-12 border-l-2 border-olive-400 pl-6 py-2">
                <p className="text-sm font-sans font-light text-charcoal-800 leading-relaxed italic">
                  A statement of intent. Carefully sourced and meticulously crafted for those who demand excellence in every detail.
                </p>
              </div>

              {/* Description */}
              <div className="border-t border-charcoal-900/10 py-8">
                <div className="prose prose-sm max-w-none font-sans font-light text-charcoal-800/80 leading-loose" dangerouslySetInnerHTML={{ __html: product.description_html || '<p>No detail provided.</p>' }} />
              </div>
              
              {product.variants.length > 0 && (
                <div className="border-t border-charcoal-900/10 py-8">
                  <h3 className="text-[10px] font-sans tracking-[0.2em] uppercase text-charcoal-900 mb-4">Available Iterations</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <span key={i} className="text-xs font-serif italic text-charcoal-800 px-3 py-1 border border-charcoal-900/20">
                        {v.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products - Asymmetric */}
        {related && related.length > 0 && (
          <div className="mt-40 pt-20 border-t border-charcoal-900/10">
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-16 text-center">Curated Pairings</h2>
            <ProductList products={related.slice(0, 4)} isLoading={false} hasMore={false} fetchNextPage={() => {}} isFetchingNextPage={false} />
          </div>
        )}
      </div>
    </div>
  );
}
