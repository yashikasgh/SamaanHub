import { useState, useEffect } from 'react';
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
  
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?q=${encodeURIComponent(search.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const uniqueCategories = categories?.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.name === c.name) === i) || [];
  
  const headerClass = isHome 
    ? `fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-ivory-50 shadow-sm py-3 text-charcoal-900' : 'bg-transparent py-6 text-ivory-50'}`
    : 'sticky top-0 w-full z-40 transition-all duration-300 bg-ivory-50 shadow-sm py-3 text-charcoal-900';

  return (
    <>
      <header className={headerClass}>
        <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2" aria-label="Menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <nav className="hidden lg:flex items-center space-x-6">
              <Link to="/" className="text-[11px] font-sans tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">Shop All</Link>
              {uniqueCategories.slice(0, 4).map(c => (
                <Link key={c.id} to={`/categories/${c.slug}`} className="text-[11px] font-sans tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>

          <Link to="/" className="flex-shrink-0 text-center">
            <h1 className="text-2xl lg:text-3xl font-serif tracking-widest uppercase font-medium">{storeName}</h1>
          </Link>

          <div className="flex-1 flex items-center justify-end space-x-4">
            <form onSubmit={handleSearch} className={`hidden md:block relative w-48 ${isHome && !scrolled ? 'border-ivory-50/50' : 'border-charcoal-900/20'} border-b`}>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-transparent py-1 text-sm font-sans focus:outline-none placeholder:font-light placeholder:opacity-70"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </form>
            <button className="relative p-2 hover:opacity-70 transition-opacity" onClick={() => window.dispatchEvent(new Event('toggle_enquiry_sidebar'))}>
              <span className="text-[11px] font-sans tracking-[0.2em] uppercase hidden sm:block">Enquiry ({enquiry.length})</span>
              <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-charcoal-900 text-ivory-50 flex flex-col p-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-serif tracking-widest uppercase">{storeName}</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <nav className="flex flex-col space-y-6 flex-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif tracking-wider">Shop All</Link>
            {uniqueCategories.map(c => (
              <Link key={c.id} to={`/categories/${c.slug}`} onClick={() => setMobileMenuOpen(false)} className="text-3xl font-serif tracking-wider">
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto pt-6 border-t border-ivory-50/20">
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-sm font-sans tracking-[0.2em] uppercase mb-4 block">Wishlist ({wishlist.length})</Link>
            <button onClick={() => {setMobileMenuOpen(false); window.dispatchEvent(new Event('toggle_enquiry_sidebar'));}} className="text-sm font-sans tracking-[0.2em] uppercase">Enquiry ({enquiry.length})</button>
          </div>
        </div>
      )}
    </>
  );
}
