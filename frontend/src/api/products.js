import { apiDelete, apiGet, apiPostForm, apiPutForm } from "./http";

export function fetchProducts() {
  return apiGet("/api/products");
}

export function fetchProduct(id) {
  return apiGet(`/api/products/${id}`);
}

export function createProduct(formData) {
  return apiPostForm("/api/products", formData);
}

export function updateProduct(id, formData) {
  return apiPutForm(`/api/products/${id}`, formData);
}

export function deleteProduct(id) {
  return apiDelete(`/api/products/${id}`);
}
