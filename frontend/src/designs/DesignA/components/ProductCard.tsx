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
    <div className="group relative flex flex-col bg-white border border-stone-200 hover:border-stone-300 transition-colors rounded-sm overflow-hidden shadow-sm">
      <Link to={`/products/${product.slug}`} className="block relative aspect-square bg-stone-100 overflow-hidden">
        {product.thumb ? (
          <img 
            src={product.thumb} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 font-serif text-sm">
            No Image
          </div>
        )}
        {outOfStock && (
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-xs uppercase tracking-wider text-stone-800 border border-stone-200">
            Out of Stock
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/products/${product.slug}`} className="block mb-1">
          <h3 className="font-serif text-stone-800 text-lg leading-tight line-clamp-2">{product.name}</h3>
        </Link>
        <div className="text-stone-600 mb-4 font-sans text-sm tracking-wide">
          {product.price !== null ? `${product.currency} ${product.price.toLocaleString()}` : 'Price on Request'}
        </div>
        
        <div className="mt-auto flex items-center justify-between gap-1 sm:gap-2">
          <button 
            onClick={() => toggleEnquiry(product.id)}
            disabled={outOfStock && !isEnquired}
            className={`flex-1 py-2 px-2 sm:px-4 text-[10px] sm:text-xs font-sans tracking-wider sm:tracking-widest uppercase transition-colors border text-center ${
              isEnquired 
                ? 'bg-olive-500 text-white border-olive-500' 
                : outOfStock 
                  ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
                  : 'bg-stone-900 text-white border-stone-900 hover:bg-stone-800'
            }`}
          >
            {isEnquired ? 'Added' : 'Enquiry'}
          </button>
          
          <button 
            onClick={() => toggleWishlist(product.id)}
            className="p-2 text-stone-400 hover:text-terracotta-500 transition-colors"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg className={`w-5 h-5 ${isWishlisted ? 'fill-terracotta-500 text-terracotta-500' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
