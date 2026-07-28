import { spawnSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))

const iframeUrl = args['iframe-url']

if (!iframeUrl) {
  throw new Error('--iframe-url is required')
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
    IFRAME_URL: iframeUrl,
  },
})

if (status) {
  process.exit(status)
}
