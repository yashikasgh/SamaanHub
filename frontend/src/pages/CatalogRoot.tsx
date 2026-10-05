import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DesignRegistry from '../designs/Registry';
import { CatalogView } from '../designs/Contract';

export default function CatalogRoot() {
  const { slug } = useParams();
  const location = useLocation();

  let view: CatalogView = { type: 'home' };

  if (location.pathname.startsWith('/products/') && slug) {
    view = { type: 'product', slug };
  } else if (location.pathname.startsWith('/categories/') && slug) {
    view = { type: 'category', slug };
  } else if (location.pathname === '/wishlist') {
    view = { type: 'wishlist' };
  }

  return <DesignRegistry view={view} />;
}
