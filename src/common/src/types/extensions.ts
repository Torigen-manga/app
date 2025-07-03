import { z } from 'zod'

const registryEntrySchema = z.object({
  name: z.string(),
  path: z.string(),
  dependencies: z.array(z.string()).optional()
})

const registrySchema = z.record(registryEntrySchema)

type RegistryEntry = z.infer<typeof registryEntrySchema>
type Registry = z.infer<typeof registrySchema>

export type { RegistryEntry, Registry }
export { registryEntrySchema, registrySchema }
