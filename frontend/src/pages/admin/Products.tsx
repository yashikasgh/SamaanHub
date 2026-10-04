import { useState } from 'react';
import { useAdminProducts } from '../../api/adminQueries';
import { Link } from 'react-router-dom';

export default function Products() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, isFetching } = useAdminProducts(page, q);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQ(searchInput);
    setPage(1);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-serif text-stone-900">Products</h2>
        
        <form onSubmit={handleSearch} className="flex">
          <input 
            type="text" 
            placeholder="Search SKUs or Names..." 
            className="px-3 py-2 border border-stone-300 rounded-l focus:outline-none focus:border-stone-500 text-sm w-64"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" className="bg-stone-900 text-white px-4 py-2 rounded-r text-sm">Search</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-sm text-stone-500">
            <tr>
              <th className="px-6 py-3 font-medium">Image</th>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium text-right">Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">Loading...</td></tr>
            ) : data?.items.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">No products found.</td></tr>
            ) : (
              data?.items.map((p: any) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-6 py-3">
                    <div className="w-10 h-10 bg-stone-100 rounded overflow-hidden">
                      {p.thumb_url && <img src={p.thumb_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Link to={`/admin/products/${p.id}`} className="font-medium text-stone-900 hover:underline">{p.name}</Link>
                    <div className="text-xs text-stone-500">{p.sku || 'No SKU'}</div>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {p.is_published ? (
                      <span className="text-green-600 bg-green-50 px-2 py-1 rounded">Published</span>
                    ) : (
                      <span className="text-stone-500 bg-stone-100 px-2 py-1 rounded">Draft</span>
                    )}
                    {p.availability === 'out_of_stock' && <span className="ml-2 text-red-600 text-xs">Out of stock</span>}
                  </td>
                  <td className="px-6 py-3 text-sm capitalize text-stone-600">{p.source_type}</td>
                  <td className="px-6 py-3 text-sm text-right font-medium">
                    {p.price !== null ? `$${p.price}` : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {data && (
          <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex items-center justify-between">
            <div className="text-sm text-stone-500">
              Showing {(page - 1) * data.limit + 1} to {Math.min(page * data.limit, data.total)} of {data.total}
              {isFetching && <span className="ml-2">...</span>}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || isFetching}
                className="px-3 py-1 border border-stone-300 rounded bg-white text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * data.limit >= data.total || isFetching}
                className="px-3 py-1 border border-stone-300 rounded bg-white text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
