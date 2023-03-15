import { z } from 'zod'
import {
  PropertyFilterStatuses,
  PropertyFilterTypes,
} from '~/entities/property/config/enums'

export const createPropertyInputSchema = z.object({
  name: z.string().min(1),
  ownerName: z.string().min(1).optional(),
  ownerId: z.string().cuid().optional(),
  managerId: z.string().cuid().optional(),
})

export const createPropertyOutputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  ownerName: z.union([z.null(), z.string().min(1)]),
  ownerId: z.union([z.null(), z.string().cuid()]),
  managerId: z.union([z.null(), z.string().cuid()]),
})

export const getAllPropertiesInputSchema = z
  .object({
    status: z.enum(PropertyFilterStatuses).optional(),
    type: z.enum(PropertyFilterTypes).optional(),
    ownerIds: z.array(z.string().cuid()).optional(),
    ownerNames: z.array(z.string()).optional(),
    managerIds: z.array(z.string().cuid()).optional(),
  })
  .optional()

export const getAllPropertiesOutputSchema = z.array(createPropertyOutputSchema)

export const mutatePropertyInputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).optional(),
  ownerId: z.string().cuid().optional(),
  ownerName: z.string().min(1).optional(),
  managerId: z.string().cuid().optional(),
})
export const mutatePropertyOutputSchema = createPropertyOutputSchema

export const deletePropertyInputSchema = z.object({
  id: z.string().cuid(),
})
