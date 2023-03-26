import { execSync } from 'child_process'
import dockerCompose from 'docker-compose'
import dotenv from 'dotenv'
import { shutDown } from './utils'

dotenv.config({ path: '.env.test' })

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
    await dockerCompose.upAll()
    console.log(green, 'Docker container has been started')
  } catch (error) {
    throw new Error('Could not start docker container')
  }

  let connectionAttemptsLeft = 5
  let isDbReady = false

  while (connectionAttemptsLeft > 0 && !isDbReady) {
    try {
      execSync('npx prisma db push --force-reset')
      isDbReady = true
      console.log(green, 'Database has been successfully pushed')
    } catch (error) {
      console.log(gray, 'Database is not yet ready, waiting for 5 seconds')
      connectionAttemptsLeft--
      await wait(5000)
    }
  }

  if (connectionAttemptsLeft === 0 && !isDbReady) {
    await shutDown()
    throw new Error('Could not connect to a database')
  }
}
