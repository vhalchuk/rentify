import { faker } from '@faker-js/faker'
import { describe, expect, it } from '@jest/globals'
import { TRPCError } from '@trpc/server'
import { PropertyStatus } from '~/entities/property/config/enums'
import { prisma } from '~/shared/api/db.server'
import { createCaller, deleteProperty, useCreateUser } from './utils'

describe('create property', () => {
  it('should create a new property and assign user as its owner', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const name = faker.address.secondaryAddress()

    // test
    const createdProperty = await caller.create({ name })

    expect(typeof createdProperty.id).toBe('string')
    expect(createdProperty.name).toBe(name)
    expect(createdProperty.status).toBe(PropertyStatus.NotRented)
    expect(createdProperty.unregisteredOwnerName).toBeNull()
    expect(createdProperty.registeredOwnerName).toBe(user.name)
    expect(createdProperty.managerName).toBeNull()

    const property = await prisma.property.findUnique({
      where: {
        id: createdProperty.id,
      },
    })

    expect(property).not.toBeNull()

    //cleanup
    await deleteProperty(createdProperty.id)
    await deleteUser()
  })

  it('should create a new property with custom owner name', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const name = faker.address.secondaryAddress()
    const unregisteredOwnerName = faker.name.fullName()

    // test
    const createdProperty = await caller.create({
      name,
      unregisteredOwnerName,
    })

    expect(createdProperty.name).toBe(name)
    expect(createdProperty.unregisteredOwnerName).toBe(unregisteredOwnerName)
    expect(createdProperty.registeredOwnerName).toBeNull()
    expect(createdProperty.managerName).toBe(user.name)

    const property = await prisma.property.findUnique({
      where: {
        id: createdProperty.id,
      },
    })

    expect(property?.unregisteredOwnerName).toBe(unregisteredOwnerName)
    expect(property?.registeredOwnerId).toBeNull()
    expect(property?.managerId).toBe(user.id)

    //cleanup
    await deleteProperty(createdProperty.id)
    await deleteUser()
  })

  it('should not create a new property with custom owner name & assigned owner', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller = createCaller(user)
    const name = faker.address.secondaryAddress()
    const unregisteredOwnerName = faker.name.fullName()

    // test
    try {
      await caller.create({
        name,
        unregisteredOwnerName,
        registeredOwnerId: owner.id,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError)
      expect((error as TRPCError).code).toBe('BAD_REQUEST')
    }

    // cleanup
    await Promise.all([deleteUser(), deleteOwner()])
  })

  it('should create a new property with assigned owner', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller = createCaller(user)
    const name = faker.address.secondaryAddress()

    const createdProperty = await caller.create({
      name,
      registeredOwnerId: owner.id,
    })

    expect(createdProperty.registeredOwnerName).toBe(owner.name)
    expect(createdProperty.managerName).toBe(user.name)

    const property = await prisma.property.findUnique({
      where: {
        id: createdProperty.id,
      },
    })

    expect(property?.registeredOwnerId).toBe(owner.id)
    expect(property?.managerId).toBe(user.id)

    // cleanup
    await deleteProperty(createdProperty.id)
    await Promise.all([deleteUser(), deleteOwner()])
  })

  it('should create a new property with assigned manager', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [manager, deleteManager] = await useCreateUser()
    const caller = createCaller(user)
    const name = faker.address.secondaryAddress()

    // test
    const createdProperty = await caller.create({
      name,
      managerId: manager.id,
    })

    expect(createdProperty.registeredOwnerName).toBe(user.name)
    expect(createdProperty.managerName).toBe(manager.name)

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
})
