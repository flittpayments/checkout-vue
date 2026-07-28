import { spawnSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))

const checkoutPath = args['checkout-path']

if (!checkoutPath) {
  throw new Error('--checkout-path is required')
}

rmSync('dist', {
  recursive: true,
  force: true,
})

const { status } = spawnSync('rollup', ['-c'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    CHECKOUT_PATH: checkoutPath,
  },
})

if (status) {
  process.exit(status)
}
