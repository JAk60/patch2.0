import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    },
    include: [
      'react-virtualized',
      'react-is',
      'hoist-non-react-statics',
      '@material-ui/icons',
      '@material-ui/lab',
      '@material-ui/core',
      '@material-ui/core/utils'
    ],
    exclude: [
      '@material-ui/styles',
      '@material-ui/system'
    ]
  },
  resolve: {
    alias: {
      'react-virtualized': 'react-virtualized/dist/commonjs'
    }
  }
})