import { Link } from 'react-router-dom';
import { useCategories } from '../../../api/queries';
import React from 'react';

export function CategoryNav({ activeSlug }: { activeSlug?: string }) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories?.length) return null;

  const uniqueCategories = categories.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.name === c.name) === i);

  return (
    <div className="w-full overflow-x-auto no-scrollbar bg-ivory-50 sticky top-[68px] lg:top-[76px] z-30 pb-4 pt-6 px-4">
      <div className="flex justify-center space-x-4 md:space-x-8 min-w-max mx-auto px-4">
        <Link 
          to="/" 
          className={`px-5 py-2 text-[10px] sm:text-xs font-sans tracking-widest uppercase transition-all rounded-full ${
            !activeSlug ? 'bg-charcoal-900 text-ivory-50' : 'bg-transparent text-charcoal-800 border border-charcoal-900/20 hover:border-charcoal-900'
          }`}
        >
          Gallery All
        </Link>
        {uniqueCategories.map(c => (
          <Link 
            key={c.id}
            to={`/categories/${c.slug}`}
            className={`px-5 py-2 text-[10px] sm:text-xs font-sans tracking-widest uppercase transition-all rounded-full ${
              activeSlug === c.slug ? 'bg-charcoal-900 text-ivory-50' : 'bg-transparent text-charcoal-800 border border-charcoal-900/20 hover:border-charcoal-900'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
