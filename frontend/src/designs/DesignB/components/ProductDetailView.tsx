import React from 'react';
import { useProduct, useRelatedProducts, useStoreConfig } from '../../../api/queries';
import { ProductList } from './ProductList';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEnquiry } from '../../../hooks/useEnquiry';
import { getOptimizedImageUrl } from '../../../utils/image';

export function ProductDetailView({ slug }: { slug: string }) {
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: related } = useRelatedProducts(slug);
  
  const { data: config } = useStoreConfig();
  const { wishlist, toggle: toggleWishlist } = useWishlist();
  const { enquiry, toggle: toggleEnquiry } = useEnquiry();

  if (isLoading) {
    return <div className="max-w-[1440px] mx-auto px-4 py-24 animate-pulse flex flex-col lg:flex-row gap-12"><div className="w-full lg:w-2/3 h-screen bg-[#e8e3d9]"></div><div className="w-full lg:w-1/3 space-y-6 mt-12"><div className="h-12 bg-[#e8e3d9] w-3/4"></div><div className="h-6 bg-[#e8e3d9] w-1/4"></div></div></div>;
  }

  if (error || !product) {
    return <div className="py-40 text-center text-charcoal-500 font-serif text-3xl">Piece not found in gallery.</div>;
  }

  const isWishlisted = wishlist.includes(product.id);
  const isEnquired = enquiry.includes(product.id);
  const outOfStock = product.availability !== 'in_stock';

  return (
    <div className="bg-[#f6ebd8] pb-32">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-24">
          
          {/* Asymmetric Gallery - Left Side (2/3 width) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6 pt-12">
            {product.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {product.images.map((img, idx) => (
                  <div key={idx} className={`w-full bg-[#e8e3d9] relative group overflow-hidden rounded-2xl ${idx === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[3/4]'}`}>
                    <img 
                      src={getOptimizedImageUrl(img.url, idx === 0 ? 1200 : 800) || undefined} 
                      alt={img.alt || product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full aspect-[16/9] flex items-center justify-center text-charcoal-800/40 font-serif italic bg-[#e8e3d9] text-2xl rounded-2xl">
                Visual not available
              </div>
            )}
          </div>

          {/* Sticky Info Panel - Right Side (1/3 width) */}
          <div className="w-full lg:w-[35%] relative">
            <div className="lg:sticky lg:top-32 lg:pb-32 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar pt-12">
              
              <div className="mb-4 flex justify-between items-center">
                <div className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#b87661]">
                  {product.categories.map(c => c.name).join(' — ')}
                </div>
                {outOfStock && (
                  <span className="bg-charcoal-900 text-white px-2.5 py-1 text-[9px] uppercase tracking-widest rounded-full">Sold Out</span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif text-charcoal-900 leading-[1.1] mb-6">
                {product.name}
              </h1>

              <div className="text-2xl text-charcoal-900 font-sans mb-10 font-medium">
                {product.price !== null ? (
                  <span>{product.currency === 'INR' ? '₹' : product.currency}{product.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                ) : (
                  <span>Price on Request</span>
                )}
              </div>
              
              <div className="flex flex-col gap-4 mb-12">
                <button
                  onClick={() => {
                    if (!config?.whatsapp_number) {
                      alert("WhatsApp number is not configured.");
                      return;
                    }
                    const number = config.whatsapp_number.replace(/[^0-9]/g, '').replace(/^0+/, '');
                    const msg = `Hi, I'm interested in ${product.name}. Link: ${window.location.origin}/products/${product.slug}`;
                    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                  className={`w-full py-4 text-[11px] font-sans tracking-[0.2em] uppercase transition-all rounded-full shadow-lg ${
                    outOfStock 
                      ? 'bg-transparent text-charcoal-800/40 cursor-not-allowed border border-[#e4d4b8]'
                      : 'bg-[#b87661] text-white hover:bg-[#a66854] border border-[#b87661]'
                  }`}
                >
                  Enquire on WhatsApp
                </button>
                <button
                  onClick={() => toggleEnquiry(product.id)}
                  disabled={outOfStock && !isEnquired}
                  className={`w-full py-4 text-[11px] font-sans tracking-[0.2em] uppercase transition-all rounded-full ${
                    isEnquired 
                      ? 'bg-[#8c9a76] text-white border border-[#8c9a76]' 
                      : outOfStock 
                        ? 'bg-transparent text-charcoal-800/40 cursor-not-allowed border border-[#e4d4b8]'
                        : 'bg-transparent text-charcoal-900 hover:bg-charcoal-900 hover:text-white border border-charcoal-900'
                  }`}
                >
                  {isEnquired ? 'Added to Enquiry' : 'Add to Enquiry'}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-full py-4 text-[11px] font-sans tracking-[0.2em] uppercase transition-colors border rounded-full ${
                    isWishlisted 
                      ? 'border-[#b87661] text-[#b87661] bg-transparent' 
                      : 'border-[#e4d4b8] text-charcoal-900 hover:border-charcoal-900'
                  }`}
                >
                  {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              <div className="mb-10 border-l-2 border-[#b87661] pl-6 py-1">
                <p className="text-sm font-sans font-light text-charcoal-800/80 leading-relaxed italic">
                  A statement of intent. Carefully sourced and meticulously crafted for those who demand excellence in every detail.
                </p>
              </div>

              {/* Description */}
              <div className="border-t border-[#e4d4b8] py-8">
                <div className="prose prose-sm max-w-none font-sans font-light text-charcoal-800/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description_html || '<p>No detail provided.</p>' }} />
              </div>
              
              {product.variants.length > 0 && (
                <div className="border-t border-[#e4d4b8] py-8">
                  <h3 className="text-[10px] font-sans tracking-[0.2em] uppercase text-charcoal-900 mb-4">Available Iterations</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <span key={i} className="text-xs font-serif italic text-charcoal-800 px-3 py-1 border border-[#e4d4b8] rounded-full bg-white/50">
                        {v.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-32 pt-20 border-t border-[#e4d4b8]">
            <h2 className="text-4xl md:text-5xl font-serif text-charcoal-900 mb-12 text-center">Curated Pairings</h2>
            <ProductList products={related.slice(0, 4)} isLoading={false} hasMore={false} fetchNextPage={() => {}} isFetchingNextPage={false} />
          </div>
        )}
      </div>
    </div>
  );
}
