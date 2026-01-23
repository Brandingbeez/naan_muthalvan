import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
});

const STORAGE_KEY = "lms_auth";

function getTokenFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed?.token || null;
  } catch {
    return null;
  }
}

// Attach interceptors once at module load. Token is read from localStorage on every request,
// so it always uses the latest value after login/register.
api.interceptors.request.use((config) => {
  const token = getTokenFromStorage();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // If token is invalid/expired, clear it so UI can re-login.
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    return Promise.reject(err);
  }
);

