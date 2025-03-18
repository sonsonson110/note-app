export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  ENV: import.meta.env.VITE_ENV || 'development'
}
