const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    // IMPORTANT: do NOT set credentials: "include" unless you really need cookies
    // credentials: "omit",
  });

  const text = await res.text();

  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data) ||
      res.statusText ||
      "Request failed";
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export function apiGet(path) {
  return apiRequest(path);
}

export function apiDelete(path) {
  return apiRequest(path, { method: "DELETE" });
}

export function apiPostForm(path, formData) {
  return apiRequest(path, {
    method: "POST",
    body: formData,
  });
}

export function apiPutForm(path, formData) {
  return apiRequest(path, {
    method: "PUT",
    body: formData,
  });
}
