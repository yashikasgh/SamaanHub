import { useAdminStats } from '../../api/adminQueries';
import { adminApi } from '../../api/adminClient';
import { useState } from 'react';

export default function Sources() {
  const { data: stats, isLoading, refetch } = useAdminStats();
  const [acting, setActing] = useState<Record<string, string>>({});

  const handleAction = async (sourceId: string, type: string, action: 'import' | 'sync') => {
    setActing(prev => ({ ...prev, [sourceId]: action }));
    try {
      if (action === 'import') await adminApi.importSource(type);
      else await adminApi.syncSource(type);
      alert(`${action} triggered successfully. Check Sync History for progress.`);
      refetch();
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    } finally {
      setActing(prev => ({ ...prev, [sourceId]: '' }));
    }
  };

  if (isLoading) return <div className="py-8">Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-serif text-stone-900 mb-8">Sources & Import</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats?.sources.map((s: any) => (
          <div key={s.id} className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-serif text-stone-900 capitalize">{s.type}</h3>
                <p className="text-sm text-stone-500 mt-1">{s.name}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                s.last_sync_status === 'success' ? 'bg-green-100 text-green-800' :
                s.last_sync_status === 'failed' ? 'bg-red-100 text-red-800' :
                s.last_sync_status === 'running' ? 'bg-blue-100 text-blue-800 animate-pulse' : 'bg-stone-100 text-stone-800'
              }`}>
                {s.last_sync_status || 'Never Synced'}
              </span>
            </div>
            
            <div className="text-sm text-stone-600 mb-6 flex-grow">
              Last synchronized: {s.last_sync_at ? new Date(s.last_sync_at).toLocaleString() : 'Never'}
            </div>
            
            <div className="flex space-x-3 mt-auto">
              <button
                onClick={() => handleAction(s.id, s.type, 'import')}
                disabled={!!acting[s.id] || s.last_sync_status === 'running'}
                className="flex-1 px-4 py-2 bg-stone-900 text-white rounded text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
              >
                {acting[s.id] === 'import' ? 'Importing...' : 'Full Import'}
              </button>
              <button
                onClick={() => handleAction(s.id, s.type, 'sync')}
                disabled={!!acting[s.id] || s.last_sync_status === 'running'}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded text-sm font-medium hover:bg-stone-50 disabled:opacity-50 transition-colors"
              >
                {acting[s.id] === 'sync' ? 'Syncing...' : 'Quick Sync'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
