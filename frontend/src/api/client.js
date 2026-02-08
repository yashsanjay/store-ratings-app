const API_URL = import.meta.env.VITE_API_URL;

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  
  register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me"),
  changePassword: (payload) => request("/auth/change-password", { method: "POST", body: payload }),

  listStores: (params = {}, tokenOptional = true) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/stores${qs ? `?${qs}` : ""}`, { auth: tokenOptional });
  },
  rateStore: (storeId, value) => request(`/stores/${storeId}/rating`, { method: "POST", body: { value } }),

  adminDashboard: () => request("/admin/dashboard"),
  adminCreateUser: (payload) => request("/admin/users", { method: "POST", body: payload }),
  adminCreateStore: (payload) => request("/admin/stores", { method: "POST", body: payload }),
  adminListUsers: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/users${qs ? `?${qs}` : ""}`);
  },
  adminListStores: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/stores${qs ? `?${qs}` : ""}`);
  },
  adminUserDetails: (id) => request(`/admin/users/${id}`),

  ownerDashboard: () => request("/owner/dashboard")
};
