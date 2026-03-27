import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import { terser } from 'rollup-plugin-terser'

const baseConfig = defineConfig({
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.build.json',
    }),
  ],
  external: ['decimal.js'],
})

export default defineConfig([
  // entry
  {
    ...baseConfig,
    input: './src/index.ts',
    output: {
      file: './dist/index.cjs',
      format: 'cjs',
    },
  },
  {
    ...baseConfig,
    input: './src/index.ts',
    output: {
      file: './dist/index.mjs',
      format: 'esm',
    },
  },
  // react
  {
    ...baseConfig,
    input: './src/react.ts',
    output: {
      file: './dist/react.cjs',
      format: 'cjs',
    },
  },
  {
    ...baseConfig,
    input: './src/react.ts',
    output: {
      file: './dist/react.mjs',
      format: 'esm',
    },
  },
  {
    input: './src/index.ts',
    plugins: [
      terser(),
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.build.json',
      }),
    ],
    output: {
      file: './dist/browser.umd.js',
      format: 'umd',
      name: 'SmartUnit',
      exports: 'named',
    },
  },
])
