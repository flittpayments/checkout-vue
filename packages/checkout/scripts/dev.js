import { spawnSync } from 'node:child_process'

const args = process.argv.slice(2)

const gulp = spawnSync('gulp', ['dev', ...args], {
  stdio: 'inherit',
  shell: true,
})

if (gulp.status) {
  process.exit(gulp.status)
}

const { status } = spawnSync('vite', [], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    ...Object.fromEntries(
      args.map(arg => {
        const [key, value = ''] = arg.replace(/^--/, '').split('=')

        return [key.replace(/-/g, '_').toUpperCase(), value]
      })
    ),
  },
})

if (status) {
  process.exit(status)
}
