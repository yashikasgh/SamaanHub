import React from 'react';
import { useStoreConfig } from '../api/queries';
import DesignA from './DesignA';
import DesignB from './DesignB';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { CatalogView } from './Contract';

const DESIGNS: Record<string, React.FC<any>> = {
  'design_a': DesignA,
  'design_b': DesignB,
};

export default function DesignRegistry({ view }: { view: CatalogView }) {
  const { data: config, isLoading, error } = useStoreConfig();

  if (isLoading) return <Loading />;
  if (error || !config) return <ErrorMessage message="Failed to load store configuration." />;

  const ActiveDesign = DESIGNS[config.active_design] || DesignA;

  return <ActiveDesign config={config} view={view} />;
}
