import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Asegúrate de que el nombre sea el mismo que el del repo en tu cuenta
  base: '/X-manikt-clon/', 
})
