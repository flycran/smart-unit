import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import { terser } from 'rollup-plugin-terser'

export default defineConfig([
  {
    input: './src/index.ts',
    plugins: [resolve(), commonjs(), typescript({
      tsconfig: './tsconfig.build.json',
    })],
    output: {
      file: './dist/index.js',
      format: 'cjs',
    },
    external: ['decimal.js'],
  },
  {
    input: './src/index.ts',
    plugins: [resolve(), commonjs(), typescript({
      tsconfig: './tsconfig.build.json',
    })],
    output: {
      file: './dist/index.esm.js',
      format: 'esm',
    },
    external: ['decimal.js'],
  },
  {
    input: './src/index.ts',
    plugins: [terser(), resolve({
      browser: true,
    }), commonjs(), typescript({
      tsconfig: './tsconfig.build.json',
    })],
    output: {
      file: './dist/browser.umd.js',
      format: 'umd',
      name: 'SmartUnit',
      exports: 'named',
    },
  },
])
