import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-8 w-8 rounded-full border-2 border-stone-800 border-t-transparent animate-spin"></div>
        <p className="mt-4 text-stone-500 font-sans text-sm tracking-widest uppercase">Loading</p>
      </div>
    </div>
  );
}
