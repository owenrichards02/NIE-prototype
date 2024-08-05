import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) =>{
  const env = loadEnv(mode, process.cwd(), '');
  return{
    define: {
      'process.env.DB_CONNECTION': JSON.stringify(env.DB_CONNECTION)
    },
    plugins: [react({
      babel: {
        presets: ['jotai/babel/preset'],
      },
    })],
    build: {
      target: 'esnext' //browsers can handle the latest ES features
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext'
      }
    }
  }
})
