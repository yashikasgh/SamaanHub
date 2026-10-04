import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../../../hooks/useWishlist';
import { useEnquiry } from '../../../hooks/useEnquiry';

export function Header({ storeName }: { storeName: string }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { enquiry } = useEnquiry();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <header className="bg-stone-50 border-b border-stone-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-serif text-stone-900 tracking-tight">{storeName}</h1>
          </Link>
          
          <div className="flex-1 max-w-md px-4 hidden sm:block">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="w-full bg-white border border-stone-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500 transition-all"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600" aria-label="Search">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/wishlist" className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors" aria-label="Wishlist">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-terracotta-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/enquiry" className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors" aria-label="Enquiry List">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              {enquiry.length > 0 && (
                <span className="absolute top-1 right-1 bg-olive-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{enquiry.length}</span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="sm:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Search catalog..." 
              className="w-full bg-white border border-stone-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:border-stone-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </form>
        </div>
      </div>
    </header>
  );
}
