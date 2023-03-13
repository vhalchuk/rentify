import { z } from 'zod'

export const createPropertyInputSchema = z.object({
  name: z.string().min(1),
  ownerName: z.string().min(1).optional(),
  ownerId: z.string().min(1).optional(),
})

export const createPropertyOutputSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  ownerName: z.union([z.null(), z.string().min(1)]),
  ownerId: z.union([z.null(), z.string().min(1)]),
  managerId: z.union([z.null(), z.string().min(1)]),
})
