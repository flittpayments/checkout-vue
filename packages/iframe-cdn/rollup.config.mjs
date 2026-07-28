import { defineConfig } from 'rollup'
import terser from '@rollup/plugin-terser'
import copy from 'rollup-plugin-copy'
import esbuild from 'rollup-plugin-esbuild'

const checkoutPath = process.env.CHECKOUT_PATH

export default defineConfig({
  input: 'src/main.js',
  output: {
    file: 'dist/index.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    {
      name: 'watch-index-html',
      buildStart() {
        this.addWatchFile('src/index.html')
      },
    },
    esbuild({
      target: 'es2015',
    }),
    terser(),
    copy({
      targets: [
        {
          src: 'src/index.html',
          dest: 'dist',
          transform: contents =>
            contents.toString().replace(/{{CHECKOUT_PATH}}/g, checkoutPath),
        },
      ],
    }),
  ],
})
