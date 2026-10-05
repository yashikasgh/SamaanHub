import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEnquiry } from '../../../hooks/useEnquiry';
import { useCategories } from '../../../api/queries';

export function Header({ storeName }: { storeName: string }) {
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist } = useWishlist();
  const { enquiry } = useEnquiry();
  const { data: categories } = useCategories();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/categories/all?q=${encodeURIComponent(search.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const uniqueCategories = useMemo(() => categories?.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.name === c.name) === i) || [], [categories]);

  return (
    <>
      <div className="bg-[#e4d4b8] text-[#59524c] py-2 text-center text-[10px] sm:text-xs font-sans font-medium hidden md:flex justify-around px-8 border-b border-[#d8c5a4]">
        <span>Curated Home Essentials</span>
        <span>Free Delivery on Orders Over ₹5000</span>
      </div>
      
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#f6ebd8] shadow-sm py-2' : 'bg-[#f6ebd8] pt-6 pb-4'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 text-charcoal-800" aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            <Link to="/" className="flex-shrink-0 z-50 w-[20%]">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-charcoal-900 tracking-tight font-medium">{storeName}</h1>
            </Link>

            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl mx-8 relative justify-center">
              <div className="w-full relative max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-charcoal-800/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search for products, categories..." 
                  className="w-full bg-white/60 border border-[#e4d4b8] rounded-full py-2.5 pl-10 pr-10 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#b87661] transition-colors placeholder:font-light"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </form>
            
            <div className="flex items-center justify-end space-x-2 sm:space-x-4 flex-shrink-0 w-[20%]">
              <Link to="/wishlist" className="relative p-2 text-charcoal-800 hover:text-[#b87661] transition-colors" aria-label="Wishlist">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-[#b87661] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-sans">{wishlist.length}</span>}
              </Link>

              <button className="relative p-2 text-charcoal-800 hover:text-[#b87661] transition-colors hidden sm:block" aria-label="Account">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </button>

              <button className="relative p-2 text-charcoal-800 hover:text-[#b87661] transition-colors" aria-label="Enquiry List" onClick={() => window.dispatchEvent(new Event('toggle_enquiry_sidebar'))}>
                <div className="relative">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  {enquiry.length > 0 && <span className="absolute -top-1 -right-1 bg-[#b87661] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-sans">{enquiry.length}</span>}
                </div>
              </button>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center justify-center space-x-8 pb-2">
            <Link to="/" className="text-[11px] font-sans font-medium text-charcoal-900 border-b border-charcoal-900 pb-1 hover:text-[#b87661] transition-colors">Home</Link>
            <Link to="/categories/all" className="text-[11px] font-sans font-medium text-charcoal-800 hover:text-[#b87661] transition-colors">All Categories</Link>
            {uniqueCategories.slice(0, 5).map(c => (
              <Link key={c.id} to={`/categories/${c.slug}`} className="text-[11px] font-sans font-medium text-charcoal-800 hover:text-[#b87661] transition-colors">
                {c.name}
              </Link>
            ))}
            <Link to="/categories/all" className="text-[11px] font-sans font-medium text-charcoal-800 hover:text-[#b87661] transition-colors">Featured</Link>
            <Link to="/categories/all" className="text-[11px] font-sans font-medium text-charcoal-800 hover:text-[#b87661] transition-colors">Our Brands</Link>
          </nav>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#f6ebd8] flex flex-col lg:hidden">
          <div className="flex justify-between p-4 border-b border-[#e4d4b8]">
            <h2 className="text-2xl font-serif text-charcoal-900 font-medium">{storeName}</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-charcoal-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-6">
            <form onSubmit={handleSearch} className="relative mb-8">
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="w-full bg-white/60 border border-[#e4d4b8] rounded-full py-3 px-4 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-[#b87661]"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </form>
            <nav className="flex flex-col space-y-6">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif text-charcoal-900 border-b border-[#e4d4b8] pb-2">Home</Link>
              <Link to="/categories/all" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif text-charcoal-900 border-b border-[#e4d4b8] pb-2">All Categories</Link>
              {uniqueCategories.map(c => (
                <Link key={c.id} to={`/categories/${c.slug}`} onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif text-charcoal-900 border-b border-[#e4d4b8] pb-2">
                  {c.name}
                </Link>
              ))}
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-lg font-serif text-charcoal-900 border-b border-[#e4d4b8] pb-2 flex items-center justify-between">
                Wishlist <span>{wishlist.length}</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
