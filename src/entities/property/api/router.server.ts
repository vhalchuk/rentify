import { type Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '~/shared/api/index.server'
import { PropertyType } from '../config/enums'
import {
  createPropertyInputSchema,
  createPropertyOutputSchema,
  deletePropertyInputSchema,
  getAllPropertiesInputSchema,
  getAllPropertiesOutputSchema,
  mutatePropertyInputSchema,
  mutatePropertyOutputSchema,
} from './schemas'

export const propertyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createPropertyInputSchema)
    .output(createPropertyOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      let unregisteredOwnerName: string | undefined
      let registeredOwnerId: string | undefined
      let managerId: string | undefined

      if (input.unregisteredOwnerName) {
        unregisteredOwnerName = input.unregisteredOwnerName
      }

      if (input.registeredOwnerId) {
        registeredOwnerId = input.registeredOwnerId
      }

      if (registeredOwnerId && unregisteredOwnerName) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either `ownerName` or `ownerId` can be specified',
        })
      }

      if (!registeredOwnerId && !unregisteredOwnerName) {
        registeredOwnerId = userId
      }

      if (input.managerId) {
        managerId = input.managerId
      }

      if (!managerId && registeredOwnerId !== userId) {
        managerId = userId
      }

      if (managerId === registeredOwnerId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'managerId cannot be equal to ownerId',
        })
      }

      const result = await ctx.prisma.property.create({
        data: {
          name: input.name,
          status: input.status,
          unregisteredOwnerName,
          registeredOwnerId,
          managerId,
        },
        include: {
          registeredOwner: {
            select: {
              name: true,
            },
          },
          manager: {
            select: {
              name: true,
            },
          },
        },
      })

      return {
        id: result.id,
        name: result.name,
        status: result.status,
        unregisteredOwnerName: result.unregisteredOwnerName,
        registeredOwnerName: result.registeredOwner?.name ?? null,
        managerName: result.manager?.name ?? null,
      }
    }),
  getMany: protectedProcedure
    .input(getAllPropertiesInputSchema)
    .output(getAllPropertiesOutputSchema)
    .query(async ({ ctx, input = {} }) => {
      const userId = ctx.session.user.id
      const {
        status,
        type,
        managerIds,
        unregisteredOwnerNames,
        registeredOwnerIds,
      } = input

      const where: Prisma.PropertyWhereInput = {}

      where.status = status

      if (type === PropertyType.Own) {
        if (registeredOwnerIds || unregisteredOwnerNames) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
          })
        }
        if (managerIds) {
          where.managerId = {
            in: managerIds,
          }
        }
        where.registeredOwnerId = userId
      } else if (type === PropertyType.Managed) {
        if (managerIds) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
          })
        }
        if (registeredOwnerIds) {
          where.registeredOwnerId = {
            in: registeredOwnerIds,
          }
        }
        if (unregisteredOwnerNames) {
          where.unregisteredOwnerName = {
            in: unregisteredOwnerNames,
          }
        }
        where.managerId = userId
      } else {
        where.OR = [
          {
            registeredOwnerId: userId,
          },
          {
            managerId: userId,
          },
        ]
      }

      const items = await ctx.prisma.property.findMany({
        where,
        include: {
          registeredOwner: {
            select: {
              id: true,
              name: true,
            },
          },
          manager: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      })

      return items.map(
        ({
          id,
          name,
          status,
          unregisteredOwnerName,
          registeredOwner,
          manager,
        }) => ({
          id,
          name,
          status,
          unregisteredOwnerName,
          registeredOwnerName: registeredOwner?.name ?? null,
          managerName: manager?.name ?? null,
        })
      )
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

      if (
        property.registeredOwnerId !== userId &&
        property.managerId !== userId
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
        })
      }

      const result = await ctx.prisma.property.update({
        where: {
          id,
        },
        data,
        include: {
          registeredOwner: {
            select: {
              name: true,
            },
          },
          manager: {
            select: {
              name: true,
            },
          },
        },
      })

      return {
        id: result.id,
        name: result.name,
        status: result.status,
        unregisteredOwnerName: result.unregisteredOwnerName,
        registeredOwnerName: result.registeredOwner?.name ?? null,
        managerName: result.manager?.name ?? null,
      }
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

      if (
        property.registeredOwnerId !== userId &&
        property.managerId !== userId
      ) {
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
