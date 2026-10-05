import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CatalogRoot from './pages/CatalogRoot';
import AdminRoot from './pages/AdminRoot';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CatalogRoot />} />
      <Route path="/products/:slug" element={<CatalogRoot />} />
      <Route path="/categories/:slug" element={<CatalogRoot />} />
      <Route path="/wishlist" element={<CatalogRoot />} />
      <Route path="/admin/*" element={<AdminRoot />} />
    </Routes>
  );
}
