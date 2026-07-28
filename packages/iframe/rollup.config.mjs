import { defineConfig } from 'rollup'
import { createRequire } from 'module'
import terser from '@rollup/plugin-terser'
import esbuild from 'rollup-plugin-esbuild'
import replace from '@rollup/plugin-replace'
import copy from 'rollup-plugin-copy'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const iframeUrl = process.env.IFRAME_URL
const isDev = process.env.ROLLUP_WATCH

export default defineConfig({
  input: 'src/main.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'checkout',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    {
      name: 'watch-demo-html',
      buildStart() {
        if (isDev) {
          this.addWatchFile('demo.html')
        }
      },
    },
    replace({
      preventAssignment: true,
      values: {
        '{{IFRAME_URL}}': iframeUrl,
      },
    }),
    esbuild({
      target: 'es2015',
    }),
    terser(),
    ...(isDev
      ? [
          copy({
            targets: [{ src: 'demo.html', dest: 'dist' }],
          }),
        ]
      : []),
  ],
})
