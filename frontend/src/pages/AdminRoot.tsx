import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../api/adminQueries';
import { adminApi, setAdminToken, removeAdminToken } from '../api/adminClient';
import Dashboard from './admin/Dashboard';
import Products from './admin/Products';
import Categories from './admin/Categories';
import Sources from './admin/Sources';
import SyncHistory from './admin/SyncHistory';
import Settings from './admin/Settings';
import ProductEdit from './admin/ProductEdit';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.login({ email, password });
      setAdminToken(res.access_token);
      window.dispatchEvent(new Event('auth_changed'));
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-stone-200">
        <h1 className="text-2xl font-serif text-stone-900 mb-6 text-center">SamaanHub Admin</h1>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input type="email" required className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <input type="password" required className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    removeAdminToken();
    window.dispatchEvent(new Event('auth_changed'));
    navigate('/admin/login');
  };

  const navs = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Sources & Import', path: '/admin/sources' },
    { name: 'Sync History', path: '/admin/sync' },
    { name: 'Settings & Design', path: '/admin/settings' },
  ];

  const NavLinks = () => (
    <>
      {navs.map(n => {
        const isActive = location.pathname === n.path || (n.path !== '/admin' && location.pathname.startsWith(n.path));
        return (
          <Link key={n.path} to={n.path} onClick={() => setMobileMenuOpen(false)} className={`block px-4 py-2 rounded-md text-sm transition-colors ${isActive ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}>
            {n.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-stone-200 p-4 flex justify-between items-center">
        <h1 className="text-xl font-serif text-stone-900">Admin</h1>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-stone-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      
      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-stone-200 flex-shrink-0 flex flex-col`}>
        <div className="p-6 hidden md:block">
          <h1 className="text-xl font-serif text-stone-900">SamaanHub</h1>
          <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-stone-200">
          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-50">
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-stone-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function AdminRoot() {
  const [isAuth, setIsAuth] = useState(useAdminAuth());

  useEffect(() => {
    const handleAuth = () => setIsAuth(useAdminAuth());
    window.addEventListener('auth_changed', handleAuth);
    window.addEventListener('unauthorized', handleAuth);
    return () => {
      window.removeEventListener('auth_changed', handleAuth);
      window.removeEventListener('unauthorized', handleAuth);
    };
  }, []);

  return (
    <Routes>
      {!isAuth ? (
        <>
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </>
      ) : (
        <Route element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductEdit />} />
          <Route path="categories" element={<Categories />} />
          <Route path="sources" element={<Sources />} />
          <Route path="sync" element={<SyncHistory />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      )}
    </Routes>
  );
}

import { Outlet } from 'react-router-dom';
