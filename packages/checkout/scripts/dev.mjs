import { spawnSync } from 'node:child_process'

const argv = process.argv.slice(2)
const env = {
  ...process.env,
  ...Object.fromEntries(
    argv.map(arg => {
      const cleanArg = arg.replace(/^--/, '')
      const index = cleanArg.indexOf('=')
      const key = index === -1 ? cleanArg : cleanArg.slice(0, index)
      const value = index === -1 ? '' : cleanArg.slice(index + 1)

      return [key.replace(/-/g, '_').toUpperCase(), value]
    })
  ),
}
const run = (command, args = []) => {
  const { status } = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
    env,
  })

  if (status !== 0) {
    process.exit(status)
  }
}

run('gulp')
run('vue-cli-service', ['serve'])
