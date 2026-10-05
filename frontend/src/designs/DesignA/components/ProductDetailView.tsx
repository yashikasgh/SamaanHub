import React, { useState } from 'react';
import { useProduct, useRelatedProducts, useStoreConfig } from '../../../api/queries';
import { Lightbox } from './Lightbox';
import { ProductList } from './ProductList';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEnquiry } from '../../../hooks/useEnquiry';
import { Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';

export function ProductDetailView({ slug }: { slug: string }) {
  const { data: product, isLoading, error } = useProduct(slug);
  const { data: related } = useRelatedProducts(slug);
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mainImageIdx, setMainImageIdx] = useState(0);
  
  const { data: config } = useStoreConfig();
  const { wishlist, toggle: toggleWishlist } = useWishlist();
  const { enquiry, toggle: toggleEnquiry } = useEnquiry();

  if (isLoading) {
    return <div className="max-w-[1440px] mx-auto px-4 py-24 animate-pulse flex flex-col lg:flex-row gap-12 lg:gap-24"><div className="w-full lg:w-1/2 aspect-[4/5] bg-cream-100 rounded-2xl"></div><div className="w-full lg:w-1/2 space-y-6 mt-12"><div className="h-12 bg-cream-100 w-3/4 rounded-md"></div><div className="h-6 bg-cream-100 w-1/4 rounded-md"></div></div></div>;
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs font-sans text-charcoal-800/60">
        <Link to="/" className="hover:text-charcoal-900 transition-colors border-b border-transparent hover:border-charcoal-900 pb-0.5">Home</Link>
        <span className="mx-2">&gt;</span>
        {product.categories[0] ? (
          <><Link to={`/categories/${product.categories[0].slug}`} className="hover:text-charcoal-900 transition-colors border-b border-transparent hover:border-charcoal-900 pb-0.5">{product.categories[0].name}</Link><span className="mx-2">&gt;</span></>
        ) : null}
        <span className="text-charcoal-900">{product.name}</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Image Gallery - Left Side */}
          <div className="w-full lg:w-[55%] flex gap-4 h-[500px] md:h-[600px] lg:h-[700px]">
            {/* Thumbnails (Vertical) */}
            <div className="hidden sm:flex flex-col space-y-3 w-24 overflow-y-auto no-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImageIdx(idx)}
                  className={`w-full aspect-square bg-cream-100 rounded-xl overflow-hidden transition-all duration-300 ${mainImageIdx === idx ? 'ring-1 ring-charcoal-900 ring-offset-2 ring-offset-ivory-50 opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-cream-100 rounded-2xl overflow-hidden relative group">
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
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-sans tracking-[0.2em] uppercase text-charcoal-900 rounded-full shadow-sm">
                  Sold Out
                </div>
              )}
              {product.images.length > 0 && (
                <button onClick={() => setLightboxIndex(mainImageIdx)} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-charcoal-900 rounded-full shadow-sm hover:text-terracotta-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                </button>
              )}
            </div>
          </div>

          {/* Product Info - Right Side (Sticky) */}
          <div className="w-full lg:w-[45%]">
            <div className="sticky top-32">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-charcoal-900 leading-[1.1] mb-2 font-medium">
                {product.name}
              </h1>
              
              <div className="flex items-center text-sm font-sans text-charcoal-800/60 mb-6 border-b border-cream-200 pb-6">
                <span className="border-b border-charcoal-800/40 pb-0.5">{product.categories[0]?.name}</span>
                <span className="mx-2">&bull;</span>
                <span>Ethically Sourced</span>
              </div>
              
              <div className="text-2xl md:text-3xl text-charcoal-900 font-sans font-medium mb-3">
                {product.price !== null ? (
                  <span>{product.currency === 'INR' ? '₹' : product.currency}{product.price.toLocaleString(undefined, { minimumFractionDigits: 0 })}</span>
                ) : (
                  <span>Price on Request</span>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 mb-6 text-sm font-sans font-medium">
                <span className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-amber-500' : 'bg-green-500'}`}></span>
                <span className={outOfStock ? 'text-amber-600' : 'text-green-600'}>{outOfStock ? 'Low stock' : 'In stock'}</span>
              </div>
              
              <div className="prose prose-sm max-w-none font-sans font-light text-charcoal-800/80 mb-8" dangerouslySetInnerHTML={{ __html: product.description_html || '<p>No description available.</p>' }} />
              
              {/* Actions */}
              <div className="flex flex-col gap-3 mb-8">
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
                  className="w-full py-3.5 px-8 text-xs font-sans tracking-[0.1em] uppercase transition-colors rounded-full shadow-sm bg-[#b87661] text-white hover:bg-[#a66854] flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.146.561 4.238 1.625 6.084L.272 23.047l5.06-1.328A11.972 11.972 0 0 0 12.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm0 22.012c-1.802 0-3.567-.484-5.114-1.4l-.367-.217-3.8.997 1.015-3.705-.238-.378A10.026 10.026 0 0 1 1.989 12.03C1.989 6.49 6.491 1.988 12.031 1.988c5.54 0 10.042 4.502 10.042 10.042 0 5.54-4.502 10.042-10.042 10.042zm5.503-7.514c-.302-.15-1.785-.882-2.062-.983-.277-.101-.479-.15-.681.15-.202.302-.781.983-.957 1.185-.176.202-.353.227-.655.076-1.396-.7-2.617-1.637-3.57-2.748-.255-.296-.027-.456.124-.606.135-.135.302-.352.453-.529.15-.176.202-.302.302-.504.101-.202.05-.378-.025-.529-.076-.15-.681-1.638-.933-2.243-.245-.589-.494-.51-.681-.519-.176-.008-.378-.008-.58-.008s-.529.076-.806.378c-.277.302-1.058 1.033-1.058 2.519s1.083 2.923 1.234 3.125c.15.202 2.13 3.25 5.158 4.557 2.015.871 2.809.932 3.864.783 1.155-.164 3.197-1.309 3.65-2.569.453-1.26.453-2.342.327-2.569-.126-.227-.453-.353-.755-.504z"/></svg>
                  ENQUIRE ON WHATSAPP
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => toggleEnquiry(product.id)}
                    disabled={outOfStock && !isEnquired}
                    className={`flex-1 py-3.5 px-8 text-xs font-sans tracking-[0.1em] uppercase transition-colors rounded-full border shadow-sm font-medium ${
                      isEnquired 
                        ? 'bg-olive-500 text-white border-olive-500' 
                        : outOfStock 
                          ? 'bg-transparent text-charcoal-800/40 border-cream-200 cursor-not-allowed'
                          : 'bg-transparent text-charcoal-900 border-charcoal-900 hover:bg-charcoal-900 hover:text-white'
                    }`}
                  >
                    {isEnquired ? 'ADDED TO ENQUIRY' : 'ADD TO ENQUIRY'}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="w-[50px] flex items-center justify-center rounded-full border border-charcoal-900/20 text-charcoal-800 hover:border-terracotta-500 hover:text-terracotta-500 transition-colors shrink-0"
                    aria-label="Toggle wishlist"
                  >
                    <svg className={`w-5 h-5 ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
                
              {/* Product Features Icons */}
              <div className="grid grid-cols-4 gap-2 text-center py-6 border-t border-b border-cream-200 mb-8">
                <div className="flex flex-col items-center">
                  <svg className="w-5 h-5 text-charcoal-800/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-[9px] tracking-wider uppercase font-sans text-charcoal-800/70">Natural Material</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-5 h-5 text-charcoal-800/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" /></svg>
                  <span className="text-[9px] tracking-wider uppercase font-sans text-charcoal-800/70">Eco-friendly</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-5 h-5 text-charcoal-800/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <span className="text-[9px] tracking-wider uppercase font-sans text-charcoal-800/70">Multi-purpose</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-5 h-5 text-charcoal-800/60 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  <span className="text-[9px] tracking-wider uppercase font-sans text-charcoal-800/70">Easy to Clean</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="space-y-4">
                <div className="border-b border-cream-200 pb-4">
                  <button className="flex justify-between w-full items-center text-sm font-sans font-medium text-charcoal-900">
                    Product Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                <div className="border-b border-cream-200 pb-4">
                  <button className="flex justify-between w-full items-center text-sm font-sans font-medium text-charcoal-900">
                    Shipping Information
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
                <div className="border-b border-cream-200 pb-4">
                  <button className="flex justify-between w-full items-center text-sm font-sans font-medium text-charcoal-900">
                    Care Instructions
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-cream-200">
            <h2 className="text-3xl font-serif text-charcoal-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.slice(0, 4).map(p => (
                <div key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
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
