import { z } from 'zod'
import { PropertyStatus, PropertyType } from '~/entities/property/config/enums'

const propertyTypeSchema = z.nativeEnum(PropertyType)
const propertyStatusSchema = z.nativeEnum(PropertyStatus)

export const createPropertyInputSchema = z.object({
  id: z.string().cuid().optional(),
  status: propertyStatusSchema.optional(),
  name: z.string().min(1),
  unregisteredOwnerName: z.string().min(1).optional(),
  registeredOwnerId: z.string().cuid().optional(),
  managerId: z.string().cuid().optional(),
})

export const createPropertyOutputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  status: propertyStatusSchema,
  unregisteredOwnerName: z.string().min(1).nullable(),
  registeredOwnerName: z.string().min(1).nullable(),
  managerName: z.string().min(1).nullable(),
})

export const getAllPropertiesInputSchema = z
  .object({
    cursor: z.string().nullish(),
    take: z.number().min(1).max(50).default(15),
    status: propertyStatusSchema.optional(),
    type: propertyTypeSchema.optional(),
    registeredOwnerIds: z.array(z.string().cuid()).optional(),
    unregisteredOwnerNames: z.array(z.string()).optional(),
    managerIds: z.array(z.string().cuid()).optional(),
  })
  .optional()

export const getAllPropertiesOutputSchema = z.array(createPropertyOutputSchema)

export const mutatePropertyInputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).optional(),
  registeredOwnerId: z.string().cuid().optional(),
  unregisteredOwnerName: z.string().min(1).optional(),
  managerId: z.string().cuid().optional(),
})
export const mutatePropertyOutputSchema = createPropertyOutputSchema

export const deletePropertyInputSchema = z.object({
  id: z.string().cuid(),
})
