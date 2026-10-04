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
  
  const { wishlist, toggle: toggleWishlist } = useWishlist();
  const { enquiry, toggle: toggleEnquiry } = useEnquiry();

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse flex flex-col md:flex-row gap-12"><div className="w-full md:w-1/2 aspect-square bg-stone-100"></div><div className="w-full md:w-1/2 space-y-4"><div className="h-10 bg-stone-100 w-3/4"></div></div></div>;
  }

  if (error || !product) {
    return <div className="py-24 text-center text-stone-500 font-serif">Product not found.</div>;
  }

  const isWishlisted = wishlist.includes(product.id);
  const isEnquired = enquiry.includes(product.id);
  const outOfStock = product.availability !== 'in_stock';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="aspect-square bg-stone-100 border border-stone-200 overflow-hidden relative">
            {product.images.length > 0 ? (
              <img 
                src={product.images[0].url} 
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-105"
                onClick={() => setLightboxIndex(0)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 font-serif">No Image</div>
            )}
            {outOfStock && (
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 text-xs font-sans tracking-widest uppercase text-stone-800 border border-stone-200">
                Out of Stock
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {product.images.slice(1).map((img, idx) => (
                <button 
                  key={idx + 1} 
                  onClick={() => setLightboxIndex(idx + 1)}
                  className="aspect-square bg-stone-100 border border-stone-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-stone-500 hover:border-stone-400 transition-colors"
                >
                  <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-2 text-xs uppercase tracking-widest text-stone-500 font-sans">
            {product.categories.map(c => c.name).join(' / ')}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-stone-900 leading-tight mb-4">
            {product.name}
          </h1>
          <div className="text-xl text-stone-600 font-sans tracking-wide mb-8">
            {product.price !== null ? (
              <span>{product.currency} {product.price.toLocaleString()}</span>
            ) : (
              <span>Price on Request</span>
            )}
            {product.compare_at_price && product.price && product.compare_at_price > product.price && (
              <span className="ml-3 text-stone-400 line-through text-lg">{product.currency} {product.compare_at_price.toLocaleString()}</span>
            )}
          </div>

          <div className="flex gap-4 mb-10 border-b border-stone-200 pb-10">
            <button
              onClick={() => toggleEnquiry(product.id)}
              disabled={outOfStock && !isEnquired}
              className={`flex-1 py-4 px-8 text-sm font-sans tracking-widest uppercase transition-colors border ${
                isEnquired 
                  ? 'bg-olive-500 text-white border-olive-500' 
                  : outOfStock 
                    ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                    : 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800'
              }`}
            >
              {isEnquired ? 'Added to Enquiry' : 'Add to Enquiry'}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="px-6 border border-stone-300 text-stone-400 hover:text-terracotta-500 hover:border-terracotta-500 transition-colors flex items-center justify-center"
              aria-label="Toggle wishlist"
            >
              <svg className={`w-6 h-6 ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {product.variants.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-sans tracking-widest uppercase text-stone-800 mb-4">Available Variants</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <div key={i} className={`px-4 py-2 border text-sm ${v.availability === 'in_stock' ? 'border-stone-300 text-stone-700 bg-white' : 'border-stone-200 text-stone-400 bg-stone-50'}`}>
                    {v.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-stone prose-sm sm:prose-base max-w-none text-stone-600 font-sans leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description_html || '<p>No description available.</p>' }} />

          {product.sku && (
            <div className="mt-8 pt-8 border-t border-stone-200 text-sm text-stone-500 font-sans tracking-wide">
              SKU: {product.sku}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related && related.length > 0 && (
        <div className="mt-24 pt-16 border-t border-stone-200">
          <h2 className="text-2xl font-serif text-stone-900 text-center mb-12">You May Also Like</h2>
          <ProductList products={related} isLoading={false} hasMore={false} fetchNextPage={() => {}} isFetchingNextPage={false} />
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox images={product.images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}
    </div>
  );
}
