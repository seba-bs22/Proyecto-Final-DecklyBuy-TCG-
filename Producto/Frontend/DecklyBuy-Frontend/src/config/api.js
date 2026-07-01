export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export const WS_BASE_URL = API_BASE_URL
  .replace(/^https/, "wss")
  .replace(/^http/, "ws");

export const apiUrl = (path) => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export const googleLoginUrl = `${API_BASE_URL}/oauth2/authorization/google`;