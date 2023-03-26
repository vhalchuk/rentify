import { execSync } from 'child_process'
import dockerCompose from 'docker-compose'
import isCI from 'is-ci'

export async function shutDown() {
  if (isCI) {
    // ️️️✅ Best Practice: Leave the DB up in dev environment
    await dockerCompose.down()
  } else {
    // ✅ Best Practice: Clean the database occasionally
    execSync('npx prisma db push --force-reset')
  }
}
