import { faker } from '@faker-js/faker'
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals'
import { TRPCError } from '@trpc/server'
import cuid from 'cuid'
import { prisma } from '~/shared/api/index.server'
import { PropertyStatus, PropertyType } from '../../config/enums'
import { propertyRouter } from '../router.server'

const createFakeUser = () => ({
  id: cuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
})

const createFakeDbProperty = ({
  ownerId = null,
  ownerName = null,
  managerId = null,
  status = PropertyStatus.NotRented,
}: {
  ownerId?: string | null
  ownerName?: string | null
  managerId?: string | null
  status?: PropertyStatus
} = {}) => ({
  id: cuid(),
  name: faker.address.secondaryAddress(),
  ownerId,
  ownerName,
  managerId,
  status,
})

const testUser = createFakeUser()

const mockSession = {
  user: testUser,
  expires: '',
}

const caller = propertyRouter.createCaller({
  session: mockSession,
  prisma,
})

beforeAll(async () => {
  await prisma.user.create({
    data: testUser,
  })
})

afterAll(async () => {
  await prisma.property.deleteMany()
  await prisma.user.delete({
    where: {
      id: testUser.id,
    },
  })
})

describe('property', () => {
  describe('create property', () => {
    it('should create a new property and assign user as its owner', async () => {
      const newProperty = { name: faker.address.secondaryAddress() }

      const createdProperty = await caller.create(newProperty)

      expect(typeof createdProperty.id).toBe('string')
      expect(createdProperty.name).toBe(newProperty.name)
      expect(createdProperty.status).toBe(PropertyStatus.NotRented)
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
        name: faker.address.secondaryAddress(),
        ownerName: faker.name.fullName(),
      }

      const createdProperty = await caller.create(newProperty)

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
      const owner = createFakeUser()

      await prisma.user.create({ data: owner })

      const newProperty = {
        name: faker.address.secondaryAddress(),
        ownerName: faker.name.fullName(),
        ownerId: owner.id,
      }

      try {
        await caller.create(newProperty)
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError)
        expect((error as TRPCError).code).toBe('BAD_REQUEST')
      }
    })

    it('should create a new property with assigned owner', async () => {
      const owner = createFakeUser()

      await prisma.user.create({
        data: owner,
      })

      const newProperty = {
        name: faker.address.secondaryAddress(),
        ownerId: owner.id,
      }

      const createdProperty = await caller.create(newProperty)

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
      const manager = createFakeUser()

      await prisma.user.create({ data: manager })

      const newProperty = {
        name: faker.address.secondaryAddress(),
        managerId: manager.id,
      }

      const createdProperty = await caller.create(newProperty)

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
    beforeAll(async () => {
      await prisma.property.deleteMany()
    })

    const manager1 = createFakeUser()
    const manager2 = createFakeUser()
    const owner1 = createFakeUser()
    const owner2 = createFakeUser()
    const ownerName1 = faker.name.fullName()
    const ownerName2 = faker.name.fullName()

    const ownPropertiesWithoutManager = [
      createFakeDbProperty({
        ownerId: testUser.id,
      }),
      createFakeDbProperty({
        ownerId: testUser.id,
        status: PropertyStatus.NotRented,
      }),
    ]

    const ownPropertiesWithManager1 = [
      createFakeDbProperty({
        ownerId: testUser.id,
        managerId: manager1.id,
      }),
      createFakeDbProperty({
        ownerId: testUser.id,
        managerId: manager1.id,
        status: PropertyStatus.Rented,
      }),
    ]

    const ownPropertiesWithManager2 = [
      createFakeDbProperty({
        ownerId: testUser.id,
        managerId: manager2.id,
        status: PropertyStatus.NotAvailable,
      }),
    ]

    const ownProperties = [
      ...ownPropertiesWithoutManager,
      ...ownPropertiesWithManager1,
      ...ownPropertiesWithManager2,
    ]

    const managedPropertiesWithOwner1 = [
      createFakeDbProperty({
        ownerId: owner1.id,
        managerId: testUser.id,
        status: PropertyStatus.Rented,
      }),
      createFakeDbProperty({
        ownerId: owner1.id,
        managerId: testUser.id,
        status: PropertyStatus.NotAvailable,
      }),
    ]

    const managedPropertiesWithOwner2 = [
      createFakeDbProperty({
        ownerId: owner2.id,
        managerId: testUser.id,
      }),
    ]

    const managedPropertiesWithOwnerName1 = [
      createFakeDbProperty({
        ownerName: ownerName1,
        managerId: testUser.id,
        status: PropertyStatus.Rented,
      }),
      createFakeDbProperty({
        ownerName: ownerName1,
        managerId: testUser.id,
        status: PropertyStatus.NotAvailable,
      }),
    ]

    const managedPropertiesWithOwnerName2 = [
      createFakeDbProperty({
        ownerName: ownerName2,
        managerId: testUser.id,
      }),
    ]

    const nonAvailableProperties = [
      createFakeDbProperty({
        ownerId: owner1.id,
      }),
      createFakeDbProperty({
        ownerId: owner2.id,
      }),
    ]

    const managedProperties = [
      ...managedPropertiesWithOwner1,
      ...managedPropertiesWithOwner2,
      ...managedPropertiesWithOwnerName1,
      ...managedPropertiesWithOwnerName2,
    ]

    const availableProperties = [...ownProperties, ...managedProperties]

    const allProperties = [...availableProperties, ...nonAvailableProperties]

    beforeAll(async () => {
      await Promise.all([
        prisma.user.create({ data: manager1 }),
        prisma.user.create({ data: owner1 }),
      ])

      await prisma.property.createMany({
        data: allProperties,
      })
    })

    it('should get all properties', async () => {
      const properties = await caller.getMany()

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedAvailableProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )

      expect(sortedProperties).toEqual(sortedAvailableProperties)
    })

    it('should get properties only properties with status NOT_RENTED', async () => {
      const properties = await caller.getMany({
        status: PropertyStatus.NotRented,
      })

      const notRentedProperties = availableProperties.filter(
        (p) => p.status === PropertyStatus.NotRented
      )

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedNotRentedProperties = notRentedProperties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )

      expect(sortedProperties).toEqual(sortedNotRentedProperties)
    })

    it('should get properties only properties with status RENTED', async () => {
      const properties = await caller.getMany({
        status: PropertyStatus.Rented,
      })

      const rentedProperties = availableProperties.filter(
        (p) => p.status === PropertyStatus.Rented
      )

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedRentedProperties = rentedProperties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )

      expect(sortedProperties).toEqual(sortedRentedProperties)
    })

    it('should get properties only properties with status NOT_AVAILABLE', async () => {
      const properties = await caller.getMany({
        status: PropertyStatus.NotAvailable,
      })

      const notAvailableProperties = availableProperties.filter(
        (p) => p.status === PropertyStatus.NotAvailable
      )

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedNotAvailableProperties = notAvailableProperties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )

      expect(sortedProperties).toEqual(sortedNotAvailableProperties)
    })

    it('should get only own properties', async () => {
      const properties = await caller.getMany({
        type: PropertyType.Own,
      })

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedOwnProperties = ownProperties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )

      expect(sortedProperties).toEqual(sortedOwnProperties)
    })

    it('should get own properties managed by manager1', async () => {
      const properties = await caller.getMany({
        type: PropertyType.Own,
        managerIds: [manager1.id],
      })

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedOwnPropertiesWithManager1 = ownPropertiesWithManager1.sort(
        (a, b) => a.id.localeCompare(b.id)
      )

      expect(sortedProperties).toEqual(sortedOwnPropertiesWithManager1)
    })

    it('should get own properties managed by manager2', async () => {
      const properties = await caller.getMany({
        type: PropertyType.Own,
        managerIds: [manager2.id],
      })

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedOwnPropertiesWithManager2 = ownPropertiesWithManager2.sort(
        (a, b) => a.id.localeCompare(b.id)
      )

      expect(sortedProperties).toEqual(sortedOwnPropertiesWithManager2)
    })

    it('should get only managed properties', async () => {
      const properties = await caller.getMany({
        type: PropertyType.Managed,
      })

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedManagedProperties = managedProperties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )

      expect(sortedProperties).toEqual(sortedManagedProperties)
    })

    it('should get managed properties owned by owner1', async () => {
      const properties = await caller.getMany({
        type: PropertyType.Managed,
        ownerIds: [owner1.id],
      })

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedManagedPropertiesWithOwner1 =
        managedPropertiesWithOwner1.sort((a, b) => a.id.localeCompare(b.id))

      expect(sortedProperties).toEqual(sortedManagedPropertiesWithOwner1)
    })

    it('should get managed properties owned by owner2', async () => {
      const properties = await caller.getMany({
        type: PropertyType.Managed,
        ownerIds: [owner2.id],
      })

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedManagedPropertiesWithOwner2 =
        managedPropertiesWithOwner2.sort((a, b) => a.id.localeCompare(b.id))

      expect(sortedProperties).toEqual(sortedManagedPropertiesWithOwner2)
    })

    it('should get managed properties with ownerName1', async () => {
      const properties = await caller.getMany({
        type: PropertyType.Managed,
        ownerNames: [ownerName1],
      })

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedManagedPropertiesWithOwnerName1 =
        managedPropertiesWithOwnerName1.sort((a, b) => a.id.localeCompare(b.id))

      expect(sortedProperties).toEqual(sortedManagedPropertiesWithOwnerName1)
    })

    it('should get managed properties with ownerName2', async () => {
      const properties = await caller.getMany({
        type: PropertyType.Managed,
        ownerNames: [ownerName2],
      })

      const sortedProperties = properties.sort((a, b) =>
        a.id.localeCompare(b.id)
      )
      const sortedManagedPropertiesWithOwnerName2 =
        managedPropertiesWithOwnerName2.sort((a, b) => a.id.localeCompare(b.id))

      expect(sortedProperties).toEqual(sortedManagedPropertiesWithOwnerName2)
    })
  })

  describe('mutate property', () => {
    it('should mutate the name of the property', async () => {
      const newProperty = { name: faker.address.secondaryAddress() }
      const newName = 'New test property name'

      const createdProperty = await caller.create(newProperty)

      const changedProperty = await caller.mutate({
        id: createdProperty.id,
        name: newName,
      })

      expect(typeof changedProperty.id).toBe('string')
      expect(changedProperty.name).toBe(newName)

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property?.name).toBe(newName)
    })

    it('should mutate the ownerName of the property', async () => {
      const newProperty = {
        name: faker.address.secondaryAddress(),
        ownerName: faker.name.fullName(),
      }
      const newOwnerName = faker.name.fullName()

      const createdProperty = await caller.create(newProperty)

      const changedProperty = await caller.mutate({
        id: createdProperty.id,
        ownerName: newOwnerName,
      })

      expect(typeof changedProperty.id).toBe('string')
      expect(changedProperty?.ownerName).toBe(newOwnerName)

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property?.ownerName).toBe(newOwnerName)
    })

    it('should mutate the managerId of the property', async () => {
      const manager = createFakeUser()
      const newProperty = { name: faker.address.secondaryAddress() }

      const createdProperty = await caller.create(newProperty)

      const changedProperty = await caller.mutate({
        id: createdProperty.id,
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

      expect(property?.ownerId).toBe(testUser.id)
      expect(property?.managerId).toBe(manager.id)
    })

    it('should not mutate the ownerId of the property', async () => {
      const owner = createFakeUser()

      const createdProperty = await caller.create({
        name: faker.address.secondaryAddress(),
      })

      try {
        await caller.mutate({
          id: createdProperty.id,
          ownerId: owner.id,
        })
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError)
        expect((error as TRPCError).code).toBe('BAD_REQUEST')
      }
    })

    it('should not mutate the ownerName of the property', async () => {
      const owner = createFakeUser()

      const createdOwner = await prisma.user.create({
        data: owner,
      })

      const createdProperty = await caller.create({
        name: faker.address.secondaryAddress(),
        ownerId: createdOwner.id,
      })

      try {
        await caller.mutate({
          id: createdProperty.id,
          ownerName: faker.name.fullName(),
        })
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError)
        expect((error as TRPCError).code).toBe('BAD_REQUEST')
      }
    })
  })

  describe('delete property', () => {
    it('should delete one property', async () => {
      const createdProperty = await caller.create({
        name: faker.address.secondaryAddress(),
      })

      await caller.delete({ id: createdProperty.id })

      const property = await prisma.property.findUnique({
        where: {
          id: createdProperty.id,
        },
      })

      expect(property).toBeNull()
    })
  })
})
