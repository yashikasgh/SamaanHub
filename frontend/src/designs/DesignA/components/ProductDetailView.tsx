import React, { useState } from 'react';
import { useProduct, useRelatedProducts } from '../../../api/queries';
import { Lightbox } from './Lightbox';
import { ProductList } from './ProductList';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEnquiry } from '../../../hooks/useEnquiry';

export function ProductDetailView({ slug }: { slug: string }) {
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: related } = useRelatedProducts(slug);
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  
  const { wishlist, toggle: toggleWishlist } = useWishlist();
  const { enquiry, toggle: toggleEnquiry } = useEnquiry();

  if (isLoading) {
    return <div className="max-w-[1440px] mx-auto px-4 py-24 animate-pulse flex flex-col lg:flex-row gap-12 lg:gap-24"><div className="w-full lg:w-1/2 aspect-[4/5] bg-cream-100 rounded-sm"></div><div className="w-full lg:w-1/2 space-y-6 mt-12"><div className="h-12 bg-cream-100 w-3/4"></div><div className="h-6 bg-cream-100 w-1/4"></div></div></div>;
  }

  if (error || !product) {
    return <div className="py-32 text-center text-charcoal-500 font-serif text-2xl italic">Product not found.</div>;
  }

  const isWishlisted = wishlist.includes(product.id);
  const isEnquired = enquiry.includes(product.id);
  const outOfStock = product.availability !== 'in_stock';

  return (
    <div className="bg-ivory-50 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[10px] font-sans tracking-[0.2em] uppercase text-charcoal-800/60">
        <a href="/" className="hover:text-charcoal-900 transition-colors">Home</a>
        <span className="mx-3">/</span>
        {product.categories[0] ? (
          <><a href={`/categories/${product.categories[0].slug}`} className="hover:text-charcoal-900 transition-colors">{product.categories[0].name}</a><span className="mx-3">/</span></>
        ) : null}
        <span className="text-charcoal-900">{product.name}</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Image Gallery - Left Side */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4">
            <div className="aspect-[4/5] bg-cream-100 rounded-sm overflow-hidden relative group">
              {product.images.length > 0 ? (
                <img 
                  src={product.images[mainImageIdx].url} 
                  alt={product.images[mainImageIdx].alt || product.name}
                  className="w-full h-full object-cover cursor-zoom-in transition-transform duration-1000 group-hover:scale-[1.02]"
                  onClick={() => setLightboxIndex(mainImageIdx)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal-800/40 font-serif italic bg-cream-200">Image unavailable</div>
              )}
              {outOfStock && (
                <div className="absolute top-4 left-4 bg-ivory-50/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-sans tracking-[0.2em] uppercase text-charcoal-900 rounded-sm">
                  Sold Out
                </div>
              )}
              {product.images.length > 0 && (
                <button onClick={() => setLightboxIndex(mainImageIdx)} className="absolute top-4 right-4 p-2 bg-ivory-50/90 backdrop-blur-sm text-charcoal-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </button>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImageIdx(idx)}
                    className={`flex-shrink-0 w-20 h-24 sm:w-24 sm:h-28 bg-cream-100 rounded-sm overflow-hidden transition-all duration-300 ${mainImageIdx === idx ? 'ring-1 ring-charcoal-900 ring-offset-2 ring-offset-ivory-50 opacity-100' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Right Side (Sticky) */}
          <div className="w-full lg:w-[45%] lg:py-10">
            <div className="sticky top-32">
              <div className="mb-4 text-[11px] font-sans tracking-[0.2em] uppercase text-charcoal-800/60">
                {product.categories.map(c => c.name).join(' / ')}
              </div>
              
              <div className="flex justify-between items-start mb-6 gap-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-charcoal-900 leading-[1.1] font-medium">
                  {product.name}
                </h1>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2 -mr-2 text-charcoal-800/40 hover:text-terracotta-500 transition-colors shrink-0"
                  aria-label="Toggle wishlist"
                >
                  <svg className={`w-6 h-6 ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="text-xl md:text-2xl text-charcoal-800 font-sans tracking-wide mb-8 font-light">
                {product.price !== null ? (
                  <span>{product.currency} {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                ) : (
                  <span>Price on Request</span>
                )}
                {product.compare_at_price && product.price && product.compare_at_price > product.price && (
                  <span className="ml-4 text-charcoal-800/40 line-through text-lg">{product.currency} {product.compare_at_price.toLocaleString()}</span>
                )}
              </div>
              
              {/* Actions Box */}
              <div className="bg-cream-100/50 rounded-sm p-6 mb-10 border border-cream-200">
                {product.variants.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs font-sans tracking-[0.1em] uppercase text-charcoal-900 mb-3">Variants</label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v, i) => (
                        <div key={i} className={`px-4 py-2 border text-sm font-light rounded-sm ${v.availability === 'in_stock' ? 'border-charcoal-900/20 text-charcoal-900 bg-white' : 'border-charcoal-900/10 text-charcoal-800/40 bg-transparent'}`}>
                          {v.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => toggleEnquiry(product.id)}
                  disabled={outOfStock && !isEnquired}
                  className={`w-full py-4 px-8 text-[11px] font-sans tracking-[0.2em] uppercase transition-colors rounded-sm shadow-sm ${
                    isEnquired 
                      ? 'bg-olive-500 text-ivory-50' 
                      : outOfStock 
                        ? 'bg-cream-200 text-charcoal-800/40 cursor-not-allowed border border-cream-200'
                        : 'bg-charcoal-900 text-ivory-50 hover:bg-terracotta-500'
                  }`}
                >
                  {isEnquired ? 'Added to Enquiry' : 'Enquire on WhatsApp'}
                </button>
                
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 text-olive-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-[10px] tracking-[0.1em] uppercase font-sans text-charcoal-800/60">Quality Checked</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 text-olive-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span className="text-[10px] tracking-[0.1em] uppercase font-sans text-charcoal-800/60">Secure Payment</span>
                  </div>
                  <div className="hidden md:flex flex-col items-center">
                    <svg className="w-5 h-5 text-olive-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="text-[10px] tracking-[0.1em] uppercase font-sans text-charcoal-800/60">Fast Support</span>
                  </div>
                </div>
              </div>

              {/* Description Accordion (Simulated) */}
              <div className="border-t border-cream-200 py-6">
                <h3 className="text-[11px] font-sans tracking-[0.2em] uppercase text-charcoal-900 mb-4 font-medium">Description</h3>
                <div className="prose prose-sm max-w-none font-sans font-light text-charcoal-800/80" dangerouslySetInnerHTML={{ __html: product.description_html || '<p>No description available.</p>' }} />
              </div>
              
              {product.sku && (
                <div className="border-t border-cream-200 py-4 text-xs text-charcoal-800/40 font-sans tracking-wide">
                  SKU: {product.sku}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-32 pt-20 border-t border-cream-200">
            <h2 className="text-3xl font-serif text-charcoal-900 italic text-center mb-16">Frequently purchased together</h2>
            <ProductList products={related} isLoading={false} hasMore={false} fetchNextPage={() => {}} isFetchingNextPage={false} />
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox images={product.images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}
