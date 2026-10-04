import { Link } from 'react-router-dom';
import { useCategories } from '../../../api/queries';
import React from 'react';

export function CategoryNav({ activeSlug }: { activeSlug?: string }) {
  const { data: categories, isLoading } = useCategories();

  if (isLoading || !categories?.length) return null;

  const uniqueCategories = categories.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.name === c.name) === i);

  return (
    <div className="w-full overflow-x-auto no-scrollbar border-b border-cream-200 bg-ivory-50 sticky top-[68px] lg:top-[90px] z-30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8 md:space-x-12">
        <Link 
          to="/" 
          className={`whitespace-nowrap py-4 text-[11px] font-sans tracking-[0.15em] uppercase transition-colors relative ${
            !activeSlug ? 'text-charcoal-900 font-medium' : 'text-charcoal-800/60 hover:text-charcoal-900'
          }`}
        >
          All
          {!activeSlug && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-charcoal-900"></span>}
        </Link>
        {uniqueCategories.map(c => (
          <Link 
            key={c.id}
            to={`/categories/${c.slug}`}
            className={`whitespace-nowrap py-4 text-[11px] font-sans tracking-[0.15em] uppercase transition-colors relative ${
              activeSlug === c.slug ? 'text-charcoal-900 font-medium' : 'text-charcoal-800/60 hover:text-charcoal-900'
            }`}
          >
            {c.name}
            {activeSlug === c.slug && <span className="absolute bottom-0 left-0 w-full h-[1px] bg-charcoal-900"></span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
