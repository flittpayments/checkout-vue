import { defineConfig } from 'rollup'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')
import del from 'rollup-plugin-delete'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default defineConfig({
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    del({ targets: 'dist/*' }),
    peerDepsExternal(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser(),
  ],
  external: ['react'],
})