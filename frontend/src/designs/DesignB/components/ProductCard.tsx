import React from 'react';
import { Link } from 'react-router-dom';
import { ProductCard as ProductCardType } from '../../../api/types';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEnquiry } from '../../../hooks/useEnquiry';
import { getOptimizedImageUrl } from '../../../utils/image';

export const ProductCard = React.memo(function ProductCard({ product }: { product: ProductCardType }) {
  const { wishlist, toggle: toggleWishlist } = useWishlist();
  const { enquiry, toggle: toggleEnquiry } = useEnquiry();

  const isWishlisted = wishlist.includes(product.id);
  const isEnquired = enquiry.includes(product.id);
  const outOfStock = product.availability !== 'in_stock';

  return (
    <div className="group relative flex flex-col bg-[#fdfaf5] rounded-2xl overflow-hidden shadow-sm border border-[#e4d4b8]/30 p-3 hover:shadow-md transition-shadow duration-300 h-full">
      <Link to={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-[#e8e3d9] overflow-hidden mb-4 rounded-xl">
        {product.thumb ? (
          <img 
            src={getOptimizedImageUrl(product.thumb, 500) || undefined} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#e8e3d9]">
            <span className="font-serif text-charcoal-800/40 text-sm italic">Image unavailable</span>
          </div>
        )}
        
        {/* Wishlist Button Overlay */}
        <button 
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-charcoal-800 hover:text-[#b87661] transition-colors z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className={`w-4 h-4 transition-all ${isWishlisted ? 'fill-[#b87661] text-[#b87661]' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </Link>
      
      <div className="flex flex-col flex-grow px-1">
        <Link to={`/products/${product.slug}`} className="block flex-1">
          <h3 className="font-sans font-medium text-charcoal-900 text-sm leading-tight mb-1 hover:text-[#b87661] transition-colors line-clamp-1">{product.name}</h3>
          <div className="text-charcoal-800/60 font-sans text-[11px] mb-2 font-light line-clamp-1">
            Premium Product
          </div>
          <div className="text-charcoal-900 font-sans text-sm font-medium mb-2">
            {product.price !== null ? `${product.currency === 'INR' ? '₹' : product.currency}${product.price.toLocaleString()}` : 'Price on Request'}
          </div>
          
          <div className="flex items-center gap-1.5 mb-4 text-[11px] font-sans font-medium">
            <span className={`w-2 h-2 rounded-full ${outOfStock ? 'bg-amber-500' : 'bg-green-500'}`}></span>
            <span className={outOfStock ? 'text-amber-600' : 'text-green-600'}>{outOfStock ? 'Low stock' : 'In stock'}</span>
          </div>
        </Link>
        
        <div className="mt-auto">
          <button 
            onClick={(e) => { e.preventDefault(); toggleEnquiry(product.id); }}
            className={`w-full py-2.5 text-[10px] font-sans tracking-[0.1em] uppercase transition-colors rounded-full font-medium ${
              isEnquired 
                ? 'bg-[#8c9a76] text-white' 
                : 'bg-[#b87661] text-white hover:bg-[#a66854]'
            }`}
          >
            {isEnquired ? 'ADDED' : 'ENQUIRE'}
          </button>
        </div>
      </div>
    </div>
  );
});
