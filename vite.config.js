import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/EMS-UI-UX/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
