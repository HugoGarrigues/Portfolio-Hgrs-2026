import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    exclude: [...configDefaults.exclude, '.worktrees/**'],
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      'next/image': resolve(__dirname, './__mocks__/next-image.tsx'),
    },
  },
})
