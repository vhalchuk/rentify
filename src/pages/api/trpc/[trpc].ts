import { createNextApiHandler } from '@trpc/server/adapters/next'
import { appRouter } from '~/server/trpc/root'
import { createTRPCContext } from '~/server/trpc/trpc'
import { env } from '~/shared/env.mjs'

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
          )
        }
      : undefined,
})
