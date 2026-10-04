import { Link } from 'react-router-dom';
import { ProductCard as ProductCardType } from '../../../api/types';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEnquiry } from '../../../hooks/useEnquiry';

export function ProductCard({ product }: { product: ProductCardType }) {
  const { wishlist, toggle: toggleWishlist } = useWishlist();
  const { enquiry, toggle: toggleEnquiry } = useEnquiry();

  const isWishlisted = wishlist.includes(product.id);
  const isEnquired = enquiry.includes(product.id);
  const outOfStock = product.availability !== 'in_stock';

  return (
    <div className="group relative flex flex-col bg-transparent overflow-hidden">
      <Link to={`/products/${product.slug}`} className="block relative aspect-[4/5] bg-cream-100 overflow-hidden mb-4 rounded-sm">
        {product.thumb ? (
          <img 
            src={product.thumb} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream-200">
            <span className="font-serif text-charcoal-800/40 text-sm italic">Image unavailable</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute top-3 left-3 bg-ivory-50/95 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-charcoal-900 rounded-sm">
            Sold Out
          </div>
        )}
        
        {/* Quick actions overlay on desktop hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:block bg-gradient-to-t from-charcoal-900/40 to-transparent">
          <button 
            onClick={(e) => { e.preventDefault(); toggleEnquiry(product.id); }}
            disabled={outOfStock && !isEnquired}
            className={`w-full py-3 text-xs font-sans tracking-[0.2em] uppercase transition-colors rounded-sm shadow-sm ${
              isEnquired 
                ? 'bg-olive-500 text-ivory-50' 
                : outOfStock 
                  ? 'bg-cream-200/90 text-charcoal-800/50 cursor-not-allowed backdrop-blur-md'
                  : 'bg-ivory-50/95 text-charcoal-900 hover:bg-ivory-50 backdrop-blur-md'
            }`}
          >
            {isEnquired ? 'Added' : 'Enquire'}
          </button>
        </div>
      </Link>
      
      <div className="flex justify-between items-start">
        <Link to={`/products/${product.slug}`} className="block flex-1 pr-4">
          <h3 className="font-serif text-charcoal-900 text-lg lg:text-xl font-medium leading-tight mb-1.5 hover:text-terracotta-500 transition-colors line-clamp-2">{product.name}</h3>
          <div className="text-charcoal-800/70 font-sans text-sm tracking-wide font-light">
            {product.price !== null ? `${product.currency} ${product.price.toLocaleString()}` : 'Price on Request'}
          </div>
        </Link>
        
        <button 
          onClick={() => toggleWishlist(product.id)}
          className="p-1.5 -mr-1.5 text-charcoal-800/40 hover:text-terracotta-500 transition-colors z-10"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg className={`w-5 h-5 transition-all ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Mobile action button (since hover isn't good on mobile) */}
      <div className="mt-4 lg:hidden">
        <button 
          onClick={() => toggleEnquiry(product.id)}
          disabled={outOfStock && !isEnquired}
          className={`w-full py-2.5 text-[10px] font-sans tracking-[0.2em] uppercase transition-colors rounded-sm border ${
            isEnquired 
              ? 'bg-olive-500 text-ivory-50 border-olive-500' 
              : outOfStock 
                ? 'bg-transparent text-charcoal-800/30 border-charcoal-800/10 cursor-not-allowed'
                : 'bg-transparent text-charcoal-900 border-charcoal-900 hover:bg-charcoal-900 hover:text-ivory-50'
          }`}
        >
          {isEnquired ? 'Added' : 'Enquire'}
        </button>
      </div>
    </div>
  );
}
