import { faker } from '@faker-js/faker'
import { describe, expect, it } from '@jest/globals'
import { TRPCError } from '@trpc/server'
import {
  createCaller,
  useCreateUser,
} from '~/entities/property/api/__tests__/utils'
import { prisma } from '~/shared/api/db.server'

describe('delete property', () => {
  it('should delete property', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperty = await caller.create({
      name: faker.address.secondaryAddress(),
    })

    // test
    await caller.delete({ id: createdProperty.id })
    const property = await prisma.property.findUnique({
      where: {
        id: createdProperty.id,
      },
    })
    expect(property).toBeNull()

    // cleanup
    await deleteUser()
  })

  it('should not delete property', async () => {
    // setup
    const [user1, deleteUser1] = await useCreateUser()
    const [user2, deleteUser2] = await useCreateUser()
    const caller1 = createCaller(user1)
    const caller2 = createCaller(user2)
    const createdProperty = await caller1.create({
      name: faker.address.secondaryAddress(),
    })

    // test
    try {
      await caller2.delete({ id: createdProperty.id })
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError)
      expect((error as TRPCError).code).toBe('FORBIDDEN')
    }
    const property = await prisma.property.findUnique({
      where: {
        id: createdProperty.id,
      },
    })
    expect(property).not.toBeNull()

    // cleanup
    await Promise.all([deleteUser1(), deleteUser2()])
  })
})
