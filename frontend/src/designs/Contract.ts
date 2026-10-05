import { StoreConfig } from '../api/types';

export type CatalogView = 
  | { type: 'home' }
  | { type: 'category'; slug: string }
  | { type: 'product'; slug: string }
  | { type: 'wishlist' };

export interface DesignProps {
  config: StoreConfig;
  view: CatalogView;
}
