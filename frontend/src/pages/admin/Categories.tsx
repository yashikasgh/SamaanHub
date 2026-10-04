import { useAdminCategories, useUpdateCategory } from '../../api/adminQueries';

export default function Categories() {
  const { data: categories, isLoading } = useAdminCategories();
  const updateCategory = useUpdateCategory();

  const toggleVisibility = (id: string, current: boolean) => {
    updateCategory.mutate({ id, data: { is_visible: !current } });
  };

  const changePosition = (id: string, pos: number) => {
    updateCategory.mutate({ id, data: { position: pos } });
  };

  if (isLoading) return <div className="py-8">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-serif text-stone-900 mb-8">Categories</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-sm text-stone-500">
            <tr>
              <th className="px-6 py-3 font-medium w-16">Pos</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium text-right">Visibility</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {categories?.items.map((c: any) => (
              <tr key={c.id} className="hover:bg-stone-50">
                <td className="px-6 py-3">
                  <input 
                    type="number" 
                    className="w-16 px-2 py-1 border border-stone-300 rounded text-sm text-center" 
                    value={c.position}
                    onChange={(e) => changePosition(c.id, parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="px-6 py-3 font-medium text-stone-900">{c.name}</td>
                <td className="px-6 py-3 text-stone-500 text-sm">{c.slug}</td>
                <td className="px-6 py-3 text-stone-500 text-sm capitalize">{c.source_type || 'Custom'}</td>
                <td className="px-6 py-3 text-right">
                  <button 
                    onClick={() => toggleVisibility(c.id, c.is_visible)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      c.is_visible ? 'bg-green-100 text-green-800' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {c.is_visible ? 'Visible' : 'Hidden'}
                  </button>
                </td>
              </tr>
            ))}
            {categories?.items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
