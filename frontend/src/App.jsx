
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./admin/layout/adminlayout";
import ProtectedLayout from "./admin/layout/protectedlayout";

import Dashboard from "./admin/pages/dashboard";
import ProductList from "./admin/pages/products/productlist";
import ProductForm from "./admin/pages/products/productform";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route so redirects don’t go to “nothing” */}
        <Route path="/" element={<div style={{ padding: 20 }}>Home</div>} />

        {/* Admin */}
        <Route element={<ProtectedLayout />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm mode="create" />} />
            <Route path="products/:id/edit" element={<ProductForm mode="edit" />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<div style={{ padding: 20 }}>Not Found</div>} />
      </Routes>
    </BrowserRouter>

  );
}
