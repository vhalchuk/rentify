import { faker } from '@faker-js/faker'
import { describe, expect, it } from '@jest/globals'
import { TRPCError } from '@trpc/server'
import {
  createCaller,
  deleteProperty,
  useCreateUser,
} from '~/entities/property/api/__tests__/utils'
import { prisma } from '~/shared/api/db.server'

describe('mutate property', () => {
  it('should mutate the name of the property', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const newName = faker.address.secondaryAddress()
    const createdProperty = await caller.create({
      name: faker.address.secondaryAddress(),
    })

    // test
    const changedProperty = await caller.mutate({
      id: createdProperty.id,
      name: newName,
    })
    expect(changedProperty.name).toBe(newName)

    const property = await prisma.property.findUnique({
      where: {
        id: createdProperty.id,
      },
    })
    expect(property?.name).toBe(newName)

    // cleanup
    await deleteProperty(createdProperty.id)
    await deleteUser()
  })

  it('should mutate the unregisteredOwnerName of the property', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const newOwnerName = faker.name.fullName()
    const createdProperty = await caller.create({
      name: faker.address.secondaryAddress(),
      unregisteredOwnerName: faker.name.fullName(),
    })

    // test
    const changedProperty = await caller.mutate({
      id: createdProperty.id,
      unregisteredOwnerName: newOwnerName,
    })
    expect(changedProperty?.unregisteredOwnerName).toBe(newOwnerName)

    const property = await prisma.property.findUnique({
      where: {
        id: createdProperty.id,
      },
    })
    expect(property?.unregisteredOwnerName).toBe(newOwnerName)

    // cleanup
    await deleteProperty(createdProperty.id)
    await deleteUser()
  })

  it('should mutate the manager of the property', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [manager, deleteManager] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperty = await caller.create({
      name: faker.address.secondaryAddress(),
    })

    // test
    const changedProperty = await caller.mutate({
      id: createdProperty.id,
      managerId: manager.id,
    })
    expect(changedProperty.registeredOwnerName).toBe(user.name)
    expect(changedProperty.managerName).toBe(manager.name)

    const property = await prisma.property.findUnique({
      where: {
        id: createdProperty.id,
      },
    })
    expect(property?.registeredOwnerId).toBe(user.id)
    expect(property?.managerId).toBe(manager.id)

    // cleanup
    await deleteProperty(createdProperty.id)
    await Promise.all([deleteUser(), deleteManager()])
  })

  it('should not mutate the unregisteredOwnerName of the property', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperty = await caller.create({
      name: faker.address.secondaryAddress(),
    })

    // test
    try {
      await caller.mutate({
        id: createdProperty.id,
        unregisteredOwnerName: faker.name.fullName(),
      })
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError)
      expect((error as TRPCError).code).toBe('BAD_REQUEST')
    }

    // cleanup
    await deleteProperty(createdProperty.id)
    await deleteUser()
  })

  it('should not mutate the owner of the property', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperty = await caller.create({
      name: faker.address.secondaryAddress(),
      unregisteredOwnerName: faker.name.fullName(),
    })

    // test
    try {
      await caller.mutate({
        id: createdProperty.id,
        registeredOwnerId: owner.id,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError)
      expect((error as TRPCError).code).toBe('BAD_REQUEST')
    }

    // cleanup
    await deleteProperty(createdProperty.id)
    await Promise.all([deleteUser(), deleteOwner()])
  })
})
