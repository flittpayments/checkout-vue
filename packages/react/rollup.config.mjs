import { defineConfig } from 'rollup'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')
import del from 'rollup-plugin-delete'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import esbuild from 'rollup-plugin-esbuild'
import terser from '@rollup/plugin-terser'

export default defineConfig({
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    peerDepsExternal(),
    esbuild({
      sourceMap: true,
      minify: false,
      target: 'esnext',
      loaders: {
        '.tsx': 'tsx',
      },
    }),
    terser(),
  ],
  external: ['react'],
})
