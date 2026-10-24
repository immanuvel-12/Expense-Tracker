// Pure Express REST API client communicating with MongoDB Atlas backend
const API = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const listeners = new Set();
const emit = (user, reason) => listeners.forEach((l) => l(user, reason));

export async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401 && body.expired) emit(null, "expired");
  if (!res.ok) throw new Error(body.error || "An unexpected error occurred");
  return body;
}

export const auth = {
  async signUp(email, password, fullName) {
    const { user } = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    emit(user);
    return { needsConfirm: false, user };
  },
  async signIn(email, password) {
    const { user } = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    emit(user);
    return { user };
  },
  async signOut() {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    emit(null);
  },
  async getUser() {
    try {
      const { user } = await api("/api/auth/me");
      return user;
    } catch {
      return null;
    }
  },
  onChange(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export const transactions = {
  async list() {
    const data = await api("/api/transactions");
    return data.transactions || [];
  },
  async add(tx) {
    const data = await api("/api/transactions", {
      method: "POST",
      body: JSON.stringify(tx),
    });
    return data.transaction;
  },
  async update(id, tx) {
    const data = await api(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(tx),
    });
    return data.transaction;
  },
  async remove(id) {
    await api(`/api/transactions/${id}`, { method: "DELETE" });
  },
  async clear() {
    await api("/api/transactions", { method: "DELETE" });
  },
};
