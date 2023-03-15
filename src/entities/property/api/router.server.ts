import { TRPCError } from '@trpc/server'
import {
  createPropertyInputSchema,
  createPropertyOutputSchema,
} from '~/entities/property'
import {
  deletePropertyInputSchema,
  getAllPropertiesInputSchema,
  getAllPropertiesOutputSchema,
  mutatePropertyInputSchema,
  mutatePropertyOutputSchema,
} from '~/entities/property/api/schemas'
import { createTRPCRouter, protectedProcedure } from '~/shared/api/index.server'

export const propertyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPropertyInputSchema)
    .output(createPropertyOutputSchema)
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id
      let ownerName: string | undefined
      let ownerId: string | undefined
      let managerId: string | undefined

      if (input.ownerName) {
        ownerName = input.ownerName
      }

      if (input.ownerId) {
        ownerId = input.ownerId
      }

      if (ownerId && ownerName) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either `ownerName` or `ownerId` can be specified',
        })
      }

      if (!ownerId && !ownerName) {
        ownerId = userId
      }

      if (input.managerId) {
        managerId = input.managerId
      }

      if (!managerId && ownerId !== userId) {
        managerId = userId
      }

      if (managerId === ownerId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'managerId cannot be equal to ownerId',
        })
      }

      return ctx.prisma.property.create({
        data: {
          name: input.name,
          ownerName,
          ownerId,
          managerId,
        },
      })
    }),
  getMany: protectedProcedure
    .input(getAllPropertiesInputSchema)
    .output(getAllPropertiesOutputSchema)
    .query(async ({ ctx, input = {} }) => {
      const userId = ctx.session.user.id
      const { type, managerIds, ownerNames, ownerIds } = input

      // fuck prisma imports
      type Where = {
        managerId?:
          | {
              in: string[]
            }
          | string
        ownerId?:
          | {
              in: string[]
            }
          | string
        ownerName?:
          | {
              in: string[]
            }
          | string
        OR?: [{ ownerId: string }, { managerId: string }]
      }

      const where: Where = {}

      if (type === 'Own') {
        if (ownerIds || ownerNames) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
          })
        }
        if (managerIds) {
          where.managerId = {
            in: managerIds,
          }
        }
        where.ownerId = userId
      } else if (type === 'Managed') {
        if (managerIds) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
          })
        }
        if (ownerIds) {
          where.ownerId = {
            in: ownerIds,
          }
        }
        if (ownerNames) {
          where.ownerName = {
            in: ownerNames,
          }
        }
        where.managerId = userId
      } else {
        where.OR = [
          {
            ownerId: userId,
          },
          {
            managerId: userId,
          },
        ]
      }

      return ctx.prisma.property.findMany({
        where,
      })
    }),
  mutate: protectedProcedure
    .input(mutatePropertyInputSchema)
    .output(mutatePropertyOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { id, ...data } = input

      const property = await ctx.prisma.property.findUnique({
        where: { id },
      })

      if (property === null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        })
      }

      if (property.ownerId !== userId && property.managerId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
        })
      }

      return ctx.prisma.property.update({
        where: {
          id,
        },
        data,
      })
    }),
  delete: protectedProcedure
    .input(deletePropertyInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { id } = input
      const userId = ctx.session.user.id

      const property = await ctx.prisma.property.findUnique({
        where: { id },
      })

      if (property === null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        })
      }

      if (property.ownerId !== userId && property.managerId !== userId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
        })
      }

      return ctx.prisma.property.delete({
        where: {
          id,
        },
      })
    }),
})
