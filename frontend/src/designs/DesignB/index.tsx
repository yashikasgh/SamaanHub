import React from 'react';
import { DesignProps } from '../Contract';

export default function DesignB({ config, view }: DesignProps) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-serif border-x-8 border-stone-800 max-w-7xl mx-auto">
      <header className="py-8 px-12 border-b-4 border-stone-800">
        <h1 className="text-5xl font-black uppercase tracking-tighter">{config.store_name}</h1>
        <p className="mt-2 text-lg italic text-stone-600">Editorial Magazine Design</p>
      </header>
      <main className="p-12">
        <p>Current View: {view.type}</p>
        <p>Catalog rendering placeholder for Design B.</p>
      </main>
    </div>
  );
}
