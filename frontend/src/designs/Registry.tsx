import React from 'react';
import { useStoreConfig } from '../api/queries';
import DesignA from './DesignA';
import DesignB from './DesignB';
import { EnquiryBar } from '../components/EnquiryBar';

export default function DesignRegistry({ view }: { view: any }) {
  const { data: config, isLoading } = useStoreConfig();

  if (isLoading || !config) {
    return <div className="min-h-screen bg-ivory-100 animate-pulse"></div>;
  }

  return (
    <>
      {config.active_design === 'design_b' ? (
        <DesignB config={config} view={view} />
      ) : (
        <DesignA config={config} view={view} />
      )}
      <EnquiryBar storeName={config.store_name} whatsappNumber={config.whatsapp_number} />
    </>
  );
}
