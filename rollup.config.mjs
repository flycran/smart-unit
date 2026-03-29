import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'

const input = {
  index: './src/index.ts',
  precision: './src/precision.ts',
}
const baseConfig = {
  input,
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
  external: ['decimal.js'],
}

export default defineConfig([
  {
    ...baseConfig,
    output: {
      dir: './dist',
      entryFileNames: '[name].cjs',
      format: 'cjs',
    },
  },
  {
    ...baseConfig,
    output: {
      dir: './dist',
      entryFileNames: '[name].mjs',
      format: 'esm',
    },
  },
])
