import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom plugin to remove timestamp-related code
const removeTimestampPlugin = () => {
  return {
    name: 'remove-timestamps',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName]
        if (chunk.type === 'chunk' && chunk.code) {
          // Remove common timestamp patterns
          chunk.code = chunk.code
            .replace(/Created:\s*new Date\(\)/gi, 'Created:null')
            .replace(/created:\s*null/gi, 'created:null')
            .replace(/\.created\s*=\s*new Date\(\)/gi, '.created=null')
            .replace(/timestamp:\s*Date\.now\(\)/gi, 'timestamp:0')
            .replace(/buildTime:\s*['"][^'"]+['"]/gi, 'buildTime:""')
            .replace(/buildDate:\s*['"][^'"]+['"]/gi, 'buildDate:""')
            .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '') // ISO date formats
            .replace(/created:\s*null/gi, 'created:null')
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    removeTimestampPlugin()
  ],
  base: './',
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
    assetsDir: 'assets',
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 3 // More aggressive compression
      },
      format: {
        comments: false,
        preamble: '',
        beautify: false
      },
      mangle: {
        safari10: true,
        toplevel: true
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        banner: '',
        intro: '',
        footer: '',
        // Additional: Ensure consistent output
        compact: true,
        generatedCode: {
          constBindings: true
        }
      }
    },
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
    legalComments: 'none',
    drop: ['debugger'],
    pure: ['console.log']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      },
      legalComments: 'none'
    }
  },
  resolve: {
    alias: {
      'react-virtualized': 'react-virtualized/dist/commonjs'
    }
  },
  define: {
    __BUILD_TIME__: '""',
    __BUILD_DATE__: '""',
    __BUILD_TIMESTAMP__: '""',
    __VERSION__: '""'
  }
})