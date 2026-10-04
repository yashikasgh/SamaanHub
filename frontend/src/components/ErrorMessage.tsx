import React from 'react';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 p-6">
      <div className="max-w-md w-full bg-white border border-red-200 p-8 rounded-sm text-center shadow-sm">
        <h2 className="text-xl font-serif text-red-800 mb-4">Something went wrong</h2>
        <p className="text-stone-600">{message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-2 bg-stone-900 text-white text-sm hover:bg-stone-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
