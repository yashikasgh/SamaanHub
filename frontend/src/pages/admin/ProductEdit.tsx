import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminProduct, useUpdateProduct } from '../../api/adminQueries';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useAdminProduct(id!);
  const updateProduct = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compare_at_price: '',
    availability: '',
    is_published: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price?.toString() || '',
        compare_at_price: product.compare_at_price?.toString() || '',
        availability: product.availability || 'in_stock',
        is_published: product.is_published,
      });
    }
  }, [product]);

  if (isLoading) return <div className="py-8">Loading product...</div>;
  if (!product) return <div className="py-8 text-red-500">Product not found.</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct.mutate({
      id: id!,
      data: {
        name: formData.name,
        price: formData.price ? parseFloat(formData.price) : null,
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        availability: formData.availability,
        is_published: formData.is_published,
      }
    }, {
      onSuccess: () => navigate('/admin/products')
    });
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate('/admin/products')} className="text-stone-500 hover:text-stone-900">&larr; Back</button>
        <h2 className="text-2xl font-serif text-stone-900">Edit Product</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <div className="mb-6 pb-6 border-b border-stone-200">
          <p className="text-sm text-stone-500 mb-1">Source: <span className="capitalize text-stone-900 font-medium">{product.source_type}</span></p>
          <p className="text-sm text-stone-500">SKU: <span className="text-stone-900 font-medium">{product.sku || 'N/A'}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
            <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Price</label>
              <input type="number" step="0.01" className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500" value={formData.price} onChange={e => setFormData(f => ({...f, price: e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Compare At Price</label>
              <input type="number" step="0.01" className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500" value={formData.compare_at_price} onChange={e => setFormData(f => ({...f, compare_at_price: e.target.value}))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Availability</label>
              <select className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 bg-white" value={formData.availability} onChange={e => setFormData(f => ({...f, availability: e.target.value}))}>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" id="pub" className="w-4 h-4 text-stone-900 border-stone-300 rounded" checked={formData.is_published} onChange={e => setFormData(f => ({...f, is_published: e.target.checked}))} />
              <label htmlFor="pub" className="ml-2 block text-sm text-stone-700">Published (Visible in Catalog)</label>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-stone-200">
            <button type="button" onClick={() => navigate('/admin/products')} className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900">Cancel</button>
            <button type="submit" disabled={updateProduct.isPending} className="px-6 py-2 bg-stone-900 text-white rounded text-sm hover:bg-stone-800 disabled:opacity-50">
              {updateProduct.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          
          <div className="text-xs text-stone-400 mt-2 text-right">
            Note: Edited fields will be locked and won't be overwritten by future syncs.
          </div>
        </form>
      </div>
    </div>
  );
}
