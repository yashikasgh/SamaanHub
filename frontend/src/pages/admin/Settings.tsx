import { useEffect, useState } from 'react';
import { useAdminSettings, useUpdateSettings } from '../../api/adminQueries';

export default function Settings() {
  const { data: settings, isLoading } = useAdminSettings();
  const updateSettings = useUpdateSettings();

  const [formData, setFormData] = useState({
    store_name: '',
    whatsapp_number: '',
    currency: '',
    active_design: '',
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        store_name: settings.store_name || '',
        whatsapp_number: settings.whatsapp_number || '',
        currency: settings.currency || 'INR',
        active_design: settings.active_design || 'design_a',
      });
    }
  }, [settings]);

  if (isLoading) return <div className="py-8">Loading settings...</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData, {
      onSuccess: () => alert('Settings saved successfully!')
    });
  };

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl font-serif text-stone-900 mb-8">Settings & Design</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          <div>
            <h3 className="text-lg font-serif text-stone-900 mb-4 pb-2 border-b border-stone-100">Design Selection</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.active_design === 'design_a' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}>
                <div className="flex items-center mb-2">
                  <input type="radio" name="design" value="design_a" className="mr-3" checked={formData.active_design === 'design_a'} onChange={e => setFormData(f => ({...f, active_design: e.target.value}))} />
                  <span className="font-medium text-stone-900">Design A</span>
                </div>
                <p className="text-sm text-stone-500 ml-7">Premium Minimal. Best for photography-led luxury catalogs.</p>
              </label>
              
              <label className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.active_design === 'design_b' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}>
                <div className="flex items-center mb-2">
                  <input type="radio" name="design" value="design_b" className="mr-3" checked={formData.active_design === 'design_b'} onChange={e => setFormData(f => ({...f, active_design: e.target.value}))} />
                  <span className="font-medium text-stone-900">Design B</span>
                </div>
                <p className="text-sm text-stone-500 ml-7">Utilitarian Grid. Best for dense B2B catalogs. (Phase 9)</p>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-serif text-stone-900 mb-4 pb-2 border-b border-stone-100">Store Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Store Name</label>
                <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500" value={formData.store_name} onChange={e => setFormData(f => ({...f, store_name: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">WhatsApp Number</label>
                  <input type="text" placeholder="+1234567890" className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500" value={formData.whatsapp_number} onChange={e => setFormData(f => ({...f, whatsapp_number: e.target.value}))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Currency</label>
                  <input type="text" className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500" value={formData.currency} onChange={e => setFormData(f => ({...f, currency: e.target.value}))} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button type="submit" disabled={updateSettings.isPending} className="px-6 py-2 bg-stone-900 text-white rounded text-sm hover:bg-stone-800 disabled:opacity-50">
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
