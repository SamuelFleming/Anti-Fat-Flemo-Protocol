import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Dedicated port for this app so other Vite projects on 5173 don't steal it.
    // strictPort: fail instead of silently moving to 5174, 5175, ...
    port: 5111,
    strictPort: true,
  },
})
