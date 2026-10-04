import { useState, useEffect } from 'react';
import { useEnquiry } from '../hooks/useEnquiry';
import { useProducts } from '../api/queries';

export function EnquiryBar({ storeName, whatsappNumber }: { storeName: string, whatsappNumber: string }) {
  const { enquiry, clear } = useEnquiry();
  const [isOpen, setIsOpen] = useState(false);

  // We need to fetch product details for the enquired IDs to generate the message
  // Just grabbing all products for now and filtering (fine for demo scale)
  const { data } = useProducts({});
  const allProducts = data?.pages.flatMap(p => p.items) || [];
  
  const enquiredProducts = allProducts.filter(p => enquiry.includes(p.id));

  useEffect(() => {
    const toggle = () => setIsOpen(o => !o);
    window.addEventListener('toggle_enquiry_sidebar', toggle);
    return () => window.removeEventListener('toggle_enquiry_sidebar', toggle);
  }, []);

  if (enquiry.length === 0) return null;

  const handleWhatsApp = () => {
    if (!whatsappNumber) {
      alert("WhatsApp number is not configured by the admin.");
      return;
    }
    
    let msg = `Hello ${storeName}, I would like to enquire about the following items:\n\n`;
    enquiredProducts.forEach((p, idx) => {
      msg += `${idx + 1}. ${p.name}\n`;
      msg += `   Link: ${window.location.origin}/products/${p.slug}\n\n`;
    });
    
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Floating Pill */}
      <div className={`fixed bottom-6 right-6 z-50 transition-transform duration-500 ${isOpen ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'}`}>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-charcoal-900 text-ivory-50 px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3 hover:bg-olive-500 transition-colors"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-olive-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-olive-500"></span>
          </span>
          <span className="text-xs font-sans tracking-[0.2em] uppercase">{enquiry.length} items in Enquiry</span>
        </button>
      </div>

      {/* Sidebar Panel */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-ivory-50 shadow-2xl z-[60] transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-cream-200">
          <h2 className="text-xl font-serif text-charcoal-900 italic">Your Enquiry</h2>
          <button onClick={() => setIsOpen(false)} className="text-charcoal-800/50 hover:text-charcoal-900 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {enquiredProducts.map(p => (
            <div key={p.id} className="flex gap-4 items-center">
              <div className="w-16 h-20 bg-cream-100 shrink-0">
                {p.thumb && <img src={p.thumb} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <div>
                <h3 className="font-serif text-charcoal-900 line-clamp-2 leading-tight">{p.name}</h3>
                <p className="text-xs font-sans text-charcoal-800/60 mt-1">{p.currency} {p.price?.toLocaleString() || 'POR'}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-cream-100 border-t border-cream-200">
          <button 
            onClick={handleWhatsApp}
            className="w-full py-4 bg-[#25D366] text-white rounded-sm font-sans text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 mb-4 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            Send on WhatsApp
          </button>
          <button onClick={clear} className="w-full text-[10px] font-sans tracking-[0.2em] uppercase text-charcoal-800/50 hover:text-charcoal-900 transition-colors">
            Clear Enquiry
          </button>
        </div>
      </div>
      
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-charcoal-900/20 backdrop-blur-sm z-[50]" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
}
