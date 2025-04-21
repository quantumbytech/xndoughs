import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild',
      target: 'esnext',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router'],
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 1000,
      reportCompressedSize: false
    },
    server: {
      host: env.VITE_HOST || 'localhost',
      port: env.VITE_PORT || 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false
        }
      },
      cors: true,
      hmr: {
        overlay: true
      }
    },
    preview: {
      port: env.VITE_PORT || 5173
    },
    define: {
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      'process.env': env
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia'],
      exclude: [],
      esbuildOptions: {
        target: 'esnext'
      }
    },
    esbuild: {
      drop: command === 'build' ? ['console', 'debugger'] : [],
      target: 'esnext'
    }
  }
}) 