import { createNextApiHandler } from '@trpc/server/adapters/next'
import { propertyRouter } from '~/entities/property/index.server'
import { createTRPCContext, createTRPCRouter } from '~/shared/api/index.server'
import { env } from '~/shared/env.mjs'

const router = createTRPCRouter({
  property: propertyRouter,
})

export type ApiRouter = typeof router

// export API handler
export default createNextApiHandler({
  router,
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
