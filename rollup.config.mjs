import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

const baseConfig = {
  plugins: [resolve(), commonjs()],
  external: ['decimal.js'],
}

const input = {
  index: './src/index.ts',
  precision: './src/precision.ts',
}

export default defineConfig([
  {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      typescript({
        tsconfig: './tsconfig.json',
        include: ['src/**/*'],
      }),
    ],
    input,
    output: {
      dir: './dist',
      entryFileNames: '[name].cjs',
      format: 'cjs',
    },
  },
  {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      typescript({
        tsconfig: './tsconfig.json',
        include: ['src/**/*'],
      }),
    ],
    input,
    output: {
      dir: './dist',
      entryFileNames: '[name].mjs',
      format: 'esm',
    },
  },
])
