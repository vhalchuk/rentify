import { exec as childProcessExec } from 'child_process'
import { promisify } from 'util'

const exec = promisify(childProcessExec)

export default async function globalTeardown() {
  await exec('docker-compose down')
}
