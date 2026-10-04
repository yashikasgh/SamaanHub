import { useAdminRuns } from '../../api/adminQueries';

export default function SyncHistory() {
  const { data: runs, isLoading } = useAdminRuns();

  if (isLoading) return <div className="py-8">Loading history...</div>;

  return (
    <div>
      <h2 className="text-2xl font-serif text-stone-900 mb-8">Sync History</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-sm text-stone-500">
            <tr>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Time</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Metrics (C/U/N/F/R)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {runs?.items.map((r: any) => (
              <tr key={r.id} className="hover:bg-stone-50">
                <td className="px-6 py-4 font-medium text-stone-900 capitalize">{r.source}</td>
                <td className="px-6 py-4 text-stone-500 text-sm capitalize">{r.kind}</td>
                <td className="px-6 py-4 text-stone-500 text-sm">
                  {new Date(r.started_at).toLocaleString()}
                  {r.finished_at && <div className="text-xs mt-1">({Math.round((new Date(r.finished_at).getTime() - new Date(r.started_at).getTime()) / 1000)}s)</div>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    r.status === 'success' ? 'bg-green-100 text-green-800' :
                    r.status === 'failed' ? 'bg-red-100 text-red-800' :
                    r.status === 'partial' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800 animate-pulse'
                  }`}>
                    {r.status}
                  </span>
                  {r.error_summary && <div className="text-xs text-red-500 mt-2 max-w-xs truncate" title={r.error_summary}>{r.error_summary}</div>}
                </td>
                <td className="px-6 py-4 text-right text-sm text-stone-600">
                  {r.status !== 'running' ? (
                    <div className="flex justify-end space-x-2">
                      <span className="text-green-600" title="Created">{r.created_count}</span>/
                      <span className="text-blue-600" title="Updated">{r.updated_count}</span>/
                      <span className="text-stone-400" title="Unchanged">{r.unchanged_count}</span>/
                      <span className="text-red-600" title="Failed">{r.failed_count}</span>/
                      <span className="text-stone-400" title="Removed">{r.removed_count}</span>
                    </div>
                  ) : '-'}
                </td>
              </tr>
            ))}
            {runs?.items.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">No sync runs recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
