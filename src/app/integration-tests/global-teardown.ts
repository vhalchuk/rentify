import { shutDown } from './utils'

export default async function globalTeardown() {
  await shutDown()
}
