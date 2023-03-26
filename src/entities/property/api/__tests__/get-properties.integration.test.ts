import { faker } from '@faker-js/faker'
import { describe } from '@jest/globals'
import {
  createCaller,
  deleteProperty,
  useCreateUser,
} from '~/entities/property/api/__tests__/utils'
import { PropertyStatus, PropertyType } from '~/entities/property/config/enums'

const sortByIds = (a: { id: string }, b: { id: string }) =>
  a.id.localeCompare(b.id)
const sorted = (items: Array<{ id: string }>) => items.sort(sortByIds)

describe('get properties', () => {
  it('should get all available properties', async () => {
    // setup
    const [user1, deleteUser1] = await useCreateUser()
    const [manager, deleteManager] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller1 = createCaller(user1)
    const availableProperties = await Promise.all([
      caller1.create({ name: faker.address.secondaryAddress() }),
      caller1.create({
        name: faker.address.secondaryAddress(),
        unregisteredOwnerName: faker.name.fullName(),
      }),
      caller1.create({
        name: faker.address.secondaryAddress(),
        registeredOwnerId: owner.id,
      }),
      caller1.create({
        name: faker.address.secondaryAddress(),
        managerId: manager.id,
      }),
    ])

    const [user2, deleteUser2] = await useCreateUser()
    const caller2 = createCaller(user2)

    const notAvailableProperties = await Promise.all([
      caller2.create({ name: faker.address.secondaryAddress() }),
      caller2.create({
        name: faker.address.secondaryAddress(),
        unregisteredOwnerName: faker.name.fullName(),
      }),
      caller2.create({
        name: faker.address.secondaryAddress(),
        registeredOwnerId: owner.id,
      }),
      caller2.create({
        name: faker.address.secondaryAddress(),
        managerId: manager.id,
      }),
    ])

    // test
    const properties = await caller1.getMany()

    expect(properties).toHaveLength(availableProperties.length)
    expect(sorted(properties)).toEqual(sorted(availableProperties))

    // cleanup
    const allPropertiesIds = [
      ...availableProperties,
      ...notAvailableProperties,
    ].map(({ id }) => id)
    await Promise.all(allPropertiesIds.map((id) => deleteProperty(id)))
    await Promise.all([
      deleteUser1(),
      deleteManager(),
      deleteOwner(),
      deleteUser2(),
    ])
  })

  it('should get properties with NOT_RENTED status', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperties = await Promise.all([
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.NotRented,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.NotRented,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.Rented,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.NotAvailable,
      }),
    ])

    // test
    const properties = await caller.getMany({
      status: PropertyStatus.NotRented,
    })
    const filtered = createdProperties.filter(
      ({ status }) => status === PropertyStatus.NotRented
    )
    expect(properties).toHaveLength(filtered.length)
    expect(sorted(properties)).toEqual(sorted(filtered))

    // cleanup
    const propertiesIds = createdProperties.map(({ id }) => id)
    await Promise.all(propertiesIds.map((id) => deleteProperty(id)))
    await deleteUser()
  })

  it('should get properties with RENTED status', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperties = await Promise.all([
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.Rented,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.Rented,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.NotRented,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.NotAvailable,
      }),
    ])

    // test
    const properties = await caller.getMany({
      status: PropertyStatus.Rented,
    })
    const filtered = createdProperties.filter(
      ({ status }) => status === PropertyStatus.Rented
    )
    expect(properties).toHaveLength(filtered.length)
    expect(sorted(properties)).toEqual(sorted(filtered))

    // cleanup
    const propertiesIds = createdProperties.map(({ id }) => id)
    await Promise.all(propertiesIds.map((id) => deleteProperty(id)))
    await deleteUser()
  })

  it('should get properties with NOT_AVAILABLE status', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperties = await Promise.all([
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.NotAvailable,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.NotAvailable,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.NotRented,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        status: PropertyStatus.Rented,
      }),
    ])

    // test
    const properties = await caller.getMany({
      status: PropertyStatus.NotAvailable,
    })
    const filtered = createdProperties.filter(
      ({ status }) => status === PropertyStatus.NotAvailable
    )
    expect(properties).toHaveLength(filtered.length)
    expect(sorted(properties)).toEqual(sorted(filtered))

    // cleanup
    const propertiesIds = createdProperties.map(({ id }) => id)
    await Promise.all(propertiesIds.map((id) => deleteProperty(id)))
    await deleteUser()
  })

  it('should get only own properties', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [manager, deleteManager] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperties = await Promise.all([
      caller.create({ name: faker.address.secondaryAddress() }),
      caller.create({
        name: faker.address.secondaryAddress(),
        unregisteredOwnerName: faker.name.fullName(),
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        registeredOwnerId: owner.id,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        managerId: manager.id,
      }),
    ])

    //test
    const properties = await caller.getMany({
      type: PropertyType.Own,
    })
    const filtered = createdProperties.filter(
      ({ registeredOwnerName }) => registeredOwnerName === user.name
    )
    expect(properties).toHaveLength(filtered.length)
    expect(sorted(properties)).toEqual(sorted(filtered))

    // cleanup
    const propertiesIds = createdProperties.map(({ id }) => id)
    await Promise.all(propertiesIds.map((id) => deleteProperty(id)))
    await Promise.all([deleteUser(), deleteManager(), deleteOwner()])
  })

  it('should get only properties with manager', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [manager, deleteManager] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperties = await Promise.all([
      caller.create({ name: faker.address.secondaryAddress() }),
      caller.create({
        name: faker.address.secondaryAddress(),
        unregisteredOwnerName: faker.name.fullName(),
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        registeredOwnerId: owner.id,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        managerId: manager.id,
      }),
    ])

    //test
    const properties = await caller.getMany({
      type: PropertyType.Own,
      managerIds: [manager.id],
    })
    const filtered = createdProperties.filter(
      ({ managerName }) => managerName === manager.name
    )
    expect(properties).toHaveLength(filtered.length)
    expect(sorted(properties)).toEqual(sorted(filtered))

    // cleanup
    const propertiesIds = createdProperties.map(({ id }) => id)
    await Promise.all(propertiesIds.map((id) => deleteProperty(id)))
    await Promise.all([deleteUser(), deleteManager(), deleteOwner()])
  })

  it('should get only managed properties', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [manager, deleteManager] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperties = await Promise.all([
      caller.create({ name: faker.address.secondaryAddress() }),
      caller.create({
        name: faker.address.secondaryAddress(),
        unregisteredOwnerName: faker.name.fullName(),
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        registeredOwnerId: owner.id,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        managerId: manager.id,
      }),
    ])

    //test
    const properties = await caller.getMany({
      type: PropertyType.Managed,
    })
    const filtered = createdProperties.filter(
      ({ managerName }) => managerName === user.name
    )
    expect(properties).toHaveLength(filtered.length)
    expect(sorted(properties)).toEqual(sorted(filtered))

    // cleanup
    const propertiesIds = createdProperties.map(({ id }) => id)
    await Promise.all(propertiesIds.map((id) => deleteProperty(id)))
    await Promise.all([deleteUser(), deleteManager(), deleteOwner()])
  })

  it('should get only properties with unregistered owner', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [manager, deleteManager] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller = createCaller(user)
    const unregisteredOwnerName = faker.name.fullName()
    const createdProperties = await Promise.all([
      caller.create({ name: faker.address.secondaryAddress() }),
      caller.create({
        name: faker.address.secondaryAddress(),
        unregisteredOwnerName,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        registeredOwnerId: owner.id,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        managerId: manager.id,
      }),
    ])

    //test
    const properties = await caller.getMany({
      type: PropertyType.Managed,
      unregisteredOwnerNames: [unregisteredOwnerName],
    })
    const filtered = createdProperties.filter(
      (i) => i.unregisteredOwnerName === unregisteredOwnerName
    )
    expect(properties).toHaveLength(filtered.length)
    expect(sorted(properties)).toEqual(sorted(filtered))

    // cleanup
    const propertiesIds = createdProperties.map(({ id }) => id)
    await Promise.all(propertiesIds.map((id) => deleteProperty(id)))
    await Promise.all([deleteUser(), deleteManager(), deleteOwner()])
  })

  it('should get only properties with registered owner', async () => {
    // setup
    const [user, deleteUser] = await useCreateUser()
    const [manager, deleteManager] = await useCreateUser()
    const [owner, deleteOwner] = await useCreateUser()
    const caller = createCaller(user)
    const createdProperties = await Promise.all([
      caller.create({ name: faker.address.secondaryAddress() }),
      caller.create({
        name: faker.address.secondaryAddress(),
        unregisteredOwnerName: faker.name.fullName(),
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        registeredOwnerId: owner.id,
      }),
      caller.create({
        name: faker.address.secondaryAddress(),
        managerId: manager.id,
      }),
    ])

    //test
    const properties = await caller.getMany({
      type: PropertyType.Managed,
      registeredOwnerIds: [owner.id],
    })
    const filtered = createdProperties.filter(
      ({ registeredOwnerName }) => registeredOwnerName === owner.name
    )
    expect(properties).toHaveLength(filtered.length)
    expect(sorted(properties)).toEqual(sorted(filtered))

    // cleanup
    const propertiesIds = createdProperties.map(({ id }) => id)
    await Promise.all(propertiesIds.map((id) => deleteProperty(id)))
    await Promise.all([deleteUser(), deleteManager(), deleteOwner()])
  })
})
