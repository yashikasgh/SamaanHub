import { Link } from 'react-router-dom';
import { ProductCard as ProductCardType } from '../../../api/types';
import { useEnquiry } from '../../../hooks/useEnquiry';

export function ProductCard({ product, featured = false }: { product: ProductCardType, featured?: boolean }) {
  const { enquiry, toggle: toggleEnquiry } = useEnquiry();

  const isEnquired = enquiry.includes(product.id);
  const outOfStock = product.availability !== 'in_stock';

  return (
    <div className="group relative flex flex-col h-full bg-cream-100 overflow-hidden">
      <Link to={`/products/${product.slug}`} className="block relative w-full h-full min-h-[400px] overflow-hidden">
        {product.thumb ? (
          <img 
            src={product.thumb} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-cream-200">
            <span className="font-serif text-charcoal-800/40 text-sm italic">Image unavailable</span>
          </div>
        )}
        <div className="absolute inset-0 bg-charcoal-900/10 group-hover:bg-charcoal-900/0 transition-colors duration-500"></div>
        
        {outOfStock && (
          <div className="absolute top-4 left-4 bg-charcoal-900 text-ivory-50 px-3 py-1 text-[9px] uppercase tracking-[0.2em] rounded-sm">
            Sold Out
          </div>
        )}
        
        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/40 to-transparent flex flex-col justify-end">
          <h3 className={`font-serif text-ivory-50 mb-2 leading-tight drop-shadow-sm ${featured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'} line-clamp-2`}>{product.name}</h3>
          <div className="text-ivory-50/90 font-sans text-sm tracking-widest font-light mb-6">
            {product.price !== null ? `${product.currency} ${product.price.toLocaleString()}` : 'Price on Request'}
          </div>
          <button 
            onClick={(e) => { e.preventDefault(); toggleEnquiry(product.id); }}
            disabled={outOfStock && !isEnquired}
            className={`w-full sm:w-auto self-start px-6 py-3 text-[10px] font-sans tracking-[0.2em] uppercase transition-all rounded-sm backdrop-blur-sm border ${
              isEnquired 
                ? 'bg-olive-500 text-ivory-50 border-olive-500' 
                : outOfStock 
                  ? 'bg-charcoal-900/50 text-ivory-50/50 border-transparent cursor-not-allowed'
                  : 'bg-ivory-50/20 text-ivory-50 border-ivory-50/40 hover:bg-ivory-50 hover:text-charcoal-900'
            }`}
          >
            {isEnquired ? 'Added' : 'Enquire'}
          </button>
        </div>
      </Link>
    </div>
  );
}
