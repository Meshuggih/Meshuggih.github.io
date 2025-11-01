export const RUNTIME = {
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  apiBase: import.meta.env.VITE_API_BASE_URL || '',
};
