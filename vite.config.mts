import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'https://openapi.work.go.kr',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
          ws: true,
        },
      },
      port: 3000,
    },
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    baseUrl: '.',
    paths: {
      '@/*': ['/*'],
    },
  };
});
