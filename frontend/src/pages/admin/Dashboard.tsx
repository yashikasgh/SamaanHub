import { useAdminStats } from '../../api/adminQueries';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) return <div className="animate-pulse flex space-x-4"><div className="h-4 bg-stone-200 rounded w-1/4"></div></div>;
  if (error) return <div className="text-red-500">Failed to load dashboard</div>;

  return (
    <div>
      <h2 className="text-2xl font-serif text-stone-900 mb-8">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <p className="text-sm text-stone-500 font-medium mb-1">Total Products</p>
          <p className="text-3xl font-serif text-stone-900">{stats?.products}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200">
          <p className="text-sm text-stone-500 font-medium mb-1">Total Categories</p>
          <p className="text-3xl font-serif text-stone-900">{stats?.categories}</p>
        </div>
      </div>

      <h3 className="text-lg font-serif text-stone-900 mb-4">Sources Overview</h3>
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-sm text-stone-500">
            <tr>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium">Last Sync</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {stats?.sources.map((s: any) => (
              <tr key={s.id}>
                <td className="px-6 py-4 text-sm font-medium capitalize">{s.type}</td>
                <td className="px-6 py-4 text-sm text-stone-600">
                  {s.last_sync_at ? new Date(s.last_sync_at).toLocaleString() : 'Never'}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    s.last_sync_status === 'success' ? 'bg-green-100 text-green-800' :
                    s.last_sync_status === 'failed' ? 'bg-red-100 text-red-800' :
                    s.last_sync_status === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-800'
                  }`}>
                    {s.last_sync_status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link to="/admin/sources" className="text-stone-600 hover:text-stone-900 underline underline-offset-2">Manage</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
