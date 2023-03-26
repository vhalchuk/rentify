import { faker } from '@faker-js/faker'
import { type User } from '@prisma/client'
import { propertyRouter } from '~/entities/property/api/router.server'
import { prisma } from '~/shared/api/db.server'

export const createCaller = (user: User) =>
  propertyRouter.createCaller({
    session: { user, expires: '' },
    prisma,
  })

export const useCreateUser = async (): Promise<
  [User, () => Promise<unknown>]
> => {
  const user = await prisma.user.create({
    data: {
      name: faker.name.fullName(),
      email: faker.internet.email(),
    },
  })

  const deleteUser = () =>
    prisma.user.delete({
      where: { id: user.id },
    })

  return [user, deleteUser]
}

export const deleteProperty = (id: string) =>
  prisma.property.delete({
    where: { id },
  })
