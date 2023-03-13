import { it, expect, describe } from '@jest/globals'
import { TRPCError } from '@trpc/server'
import cuid from 'cuid'
import { prisma } from '~/server/db'
import { appRouter } from '~/server/trpc/root'

const testUser = {
  id: cuid(),
  name: 'testuser',
  email: 'testuser@example.com',
}

const mockSession = {
  user: testUser,
  expires: '',
}

const caller = appRouter.property.createCaller({
  session: mockSession,
  prisma,
})

async function seedDb() {
  console.log('Seeding database...')

  await prisma.user.create({
    data: testUser,
  })

  console.log('\x1b[32m%s\x1b[0m', 'Database has been successfully seeded')
}

async function clearDb() {
  console.log('Clearing database...')

  await Promise.all([prisma.user.deleteMany(), prisma.property.deleteMany()])

  console.log('\x1b[32m%s\x1b[0m', 'Database has been successfully cleared')
}

beforeAll(async () => {
  await seedDb()
})

afterAll(async () => {
  await clearDb()
})

describe('property', () => {
  describe('create property', () => {
    it('should create a new property and assign user as its owner', async () => {
      const newProperty = {
        name: 'Test property',
      }

      const createdProperty = await caller.createOne(newProperty)

      expect(typeof createdProperty.id).toBe('string')
      expect(createdProperty.name).toBe(newProperty.name)
      expect(createdProperty.ownerId).toBe(testUser.id)
      expect(createdProperty.managerId).toBeNull()

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property).not.toBeNull()
    })

    it('should create a new property with custom owner name', async () => {
      const newProperty = {
        name: 'Test property',
        ownerName: 'Custom Owner',
      }

      const createdProperty = await caller.createOne(newProperty)

      expect(typeof createdProperty.id).toBe('string')
      expect(createdProperty.ownerName).toBe(newProperty.ownerName)
      expect(createdProperty.ownerId).toBeNull()
      expect(createdProperty.managerId).toBe(testUser.id)

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property).not.toBeNull()
      expect(property?.ownerName).toBe(newProperty.ownerName)
      expect(property?.ownerId).toBeNull()
      expect(property?.managerId).toBe(testUser.id)
    })

    it('should not create a new property with custom owner name & assigned owner', async () => {
      const owner = {
        id: cuid(),
        name: 'propertyowner',
        email: 'propertyowner@example.com',
      }

      await prisma.user.create({
        data: owner,
      })

      const newProperty = {
        name: 'Test property',
        ownerName: 'Custom Owner',
        ownerId: owner.id,
      }

      try {
        await caller.createOne(newProperty)
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError)
        expect((error as TRPCError).code).toBe('BAD_REQUEST')
      }
    })

    it('should create a new property with assigned owner', async () => {
      const owner = {
        id: cuid(),
        name: 'propertyowner',
        email: 'propertyowner@example.com',
      }

      await prisma.user.create({
        data: owner,
      })

      const newProperty = {
        name: 'Test property',
        ownerId: owner.id,
      }

      const createdProperty = await caller.createOne(newProperty)

      expect(typeof createdProperty.id).toBe('string')
      expect(createdProperty.ownerId).toBe(owner.id)
      expect(createdProperty.managerId).toBe(testUser.id)

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property).not.toBeNull()
      expect(property?.ownerId).toBe(owner.id)
      expect(property?.managerId).toBe(testUser.id)
    })

    it('should create a new property with assigned manager', async () => {
      const manager = {
        id: cuid(),
        name: 'propertymanager',
        email: 'propertymanager@example.com',
      }

      await prisma.user.create({
        data: manager,
      })

      const newProperty = {
        name: 'Test property',
        managerId: manager.id,
      }

      const createdProperty = await caller.createOne(newProperty)

      expect(typeof createdProperty.id).toBe('string')
      expect(createdProperty.ownerId).toBe(testUser.id)
      expect(createdProperty.managerId).toBe(manager.id)

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property).not.toBeNull()
      expect(property?.ownerId).toBe(testUser.id)
      expect(property?.managerId).toBe(manager.id)
    })
  })

  describe('get properties', () => {
    const manager = {
      id: cuid(),
      name: 'propertymanager',
      email: 'propertymanager@example.com',
    }
    const owner = {
      id: cuid(),
      name: 'propertyowner',
      email: 'propertyowner@example.com',
    }

    const ownPropertiesWithoutManager = [
      { id: cuid(), name: 'Own property #1' },
      { id: cuid(), name: 'Own property #2' },
      { id: cuid(), name: 'Own property #3' },
    ]

    const ownPropertiesWithManager = [
      {
        id: cuid(),
        name: 'Own property with manager #1 ',
        managerId: manager.id,
      },
      {
        id: cuid(),
        name: 'Own property with manager #2 ',
        managerId: manager.id,
      },
      {
        id: cuid(),
        name: 'Own property with manager #3 ',
        managerId: manager.id,
      },
    ]

    const ownProperties = [
      ...ownPropertiesWithoutManager,
      ...ownPropertiesWithManager,
    ]

    const managedProperties = [
      { id: cuid(), name: 'Own property with manager #1 ', ownerId: owner.id },
      { id: cuid(), name: 'Own property with manager #2 ', ownerId: owner.id },
      { id: cuid(), name: 'Own property with manager #3 ', ownerId: owner.id },
      {
        id: cuid(),
        name: 'Own property with manager #4 ',
        ownerName: 'Not connected owner name',
      },
      {
        id: cuid(),
        name: 'Own property with manager #5 ',
        ownerName: 'Not connected owner name',
      },
      {
        id: cuid(),
        name: 'Own property with manager #6 ',
        ownerName: 'Not connected owner name',
      },
    ]

    const allProperties = [...ownProperties, ...managedProperties]

    beforeAll(async () => {
      await Promise.all([
        prisma.user.create({ data: manager }),
        prisma.user.create({ data: owner }),
      ])

      //todo: replace prisma invocations with client api
      await prisma.property.createMany({
        data: allProperties,
      })
    })

    it('should get all properties', async () => {
      const properties = await caller.getAll()

      expect(allProperties).toEqual(expect.arrayContaining(properties))
    })

    it('should get only own properties', async () => {
      const properties = await caller.getAll({
        ownOnly: true,
      })

      expect(ownProperties).toEqual(expect.arrayContaining(properties))
    })

    it('should get only managed properties', async () => {
      const properties = await caller.getAll({
        managedOnly: true,
      })

      expect(managedProperties).toEqual(expect.arrayContaining(properties))
    })

    // todo: add tests with a status filtering
  })

  describe('mutate property', () => {
    it('should mutate the name of the property', async () => {
      const newProperty = { name: 'Test property' }
      const newName = 'New test property name'

      const createdProperty = await caller.createOne(newProperty)

      const changedProperty = await caller.mutate({
        propertyId: createdProperty.id,
        name: newName,
      })

      expect(typeof changedProperty.id).toBe('string')
      expect(changedProperty.name).toBe(newName)

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property.name).toBe(newName)
    })

    it('should mutate the ownerName of the property', async () => {
      const newProperty = { name: 'Test property', ownerName: 'Owner name' }
      const newOwnerName = 'New Owner Name'

      const createdProperty = await caller.createOne(newProperty)

      const changedProperty = await caller.mutate({
        propertyId: createdProperty.id,
        ownerName: newOwnerName,
      })

      expect(typeof changedProperty.id).toBe('string')
      expect(changedProperty.newOwnerName).toBe(newOwnerName)

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property.newOwnerName).toBe(newOwnerName)
    })

    it('should mutate the managerId of the property', async () => {
      const manager = {
        id: cuid(),
        name: 'propertyowner',
        email: 'propertyowner@example.com',
      }
      const newProperty = { name: 'Test property' }

      const createdProperty = await caller.createOne(newProperty)

      const changedProperty = await caller.mutate({
        propertyId: createdProperty.id,
        managerId: manager.id,
      })

      expect(typeof changedProperty.id).toBe('string')
      expect(changedProperty.ownerId).toBe(testUser.id)
      expect(changedProperty.managerId).toBe(manager.id)

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property.ownerId).toBe(testUser.id)
      expect(property.managerId).toBe(manager.id)
    })

    it('should not mutate the ownerId of the property', async () => {
      const owner = {
        id: cuid(),
        name: 'propertyowner',
        email: 'propertyowner@example.com',
      }

      const createdProperty = await caller.createOne({
        name: 'Test property',
      })

      try {
        await caller.mutate({
          propertyId: createdProperty.id,
          ownerId: owner.id,
        })
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError)
        expect((error as TRPCError).code).toBe('BAD_REQUEST')
      }
    })

    it('should not mutate the ownerName of the property', async () => {
      const owner = {
        id: cuid(),
        name: 'propertyowner',
        email: 'propertyowner@example.com',
      }

      const createdOwner = await prisma.user.create({
        data: owner,
      })

      const createdProperty = await caller.createOne({
        name: 'Test property',
        ownerId: createdOwner.id,
      })

      try {
        await caller.mutate({
          propertyId: createdProperty.id,
          ownerName: 'Whatever',
        })
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError)
        expect((error as TRPCError).code).toBe('BAD_REQUEST')
      }
    })
  })

  describe('delete property', () => {
    it('should delete one property', async () => {
      const createdProperty = await caller.createOne({
        name: 'Test property',
      })

      await caller.deleteOne({ propertyId: createdProperty.id })

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property).toBeNull()
    })
  })
})
