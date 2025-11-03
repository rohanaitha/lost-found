// Central backend URL configuration
// Use VITE_BACKEND_URL if provided, otherwise fall back to production URL in PROD
// and localhost during development.
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ??
  (import.meta.env.PROD
    ? "https://lost-found-rtox.onrender.com"
    : "http://localhost:5000");

export default BACKEND_URL;
