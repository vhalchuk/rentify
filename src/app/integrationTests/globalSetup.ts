import { exec as childProcessExec } from 'child_process'
import dotenv from 'dotenv'
import { promisify } from 'util'

dotenv.config({ path: '.env.test' })

const exec = promisify(childProcessExec)

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}

const green = '\x1b[32m'
const gray = '\x1b[90m'

export default async function globalSetup() {
  console.log(gray, '\nRunning global setup for integration tests')

  try {
    await exec('docker-compose up -d')
    console.log(green, 'Docker container has been started')
  } catch (error) {
    throw new Error('Could not start docker container')
  }

  let connectionAttemptsLeft = 5
  let isDbReady = false

  while (connectionAttemptsLeft > 0 && !isDbReady) {
    try {
      await exec('npx prisma db push')
      console.log(green, 'Database has been successfully pushed')
      isDbReady = true
    } catch (error) {
      console.log(gray, 'Database is not yet ready, waiting for 5 seconds')
      connectionAttemptsLeft--
      await wait(5000)
    }
  }

  if (connectionAttemptsLeft === 0 && !isDbReady) {
    await exec('docker-compose down')
    throw new Error('Could not push database')
  }
}
