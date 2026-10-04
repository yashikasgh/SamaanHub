import { Link } from 'react-router-dom';
import { useCategories } from '../../../api/queries';
import React from 'react';

export function CategoryNav({ activeSlug }: { activeSlug?: string }) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories?.length) return null;

  return (
    <div className="w-full overflow-x-auto no-scrollbar border-b border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
        <Link 
          to="/" 
          className={`whitespace-nowrap py-4 text-sm font-sans tracking-wide uppercase transition-colors ${
            !activeSlug ? 'border-b-2 border-stone-800 text-stone-900' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          All
        </Link>
        {categories.map(c => (
          <Link 
            key={c.id}
            to={`/categories/${c.slug}`}
            className={`whitespace-nowrap py-4 text-sm font-sans tracking-wide uppercase transition-colors ${
              activeSlug === c.slug ? 'border-b-2 border-stone-800 text-stone-900' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
