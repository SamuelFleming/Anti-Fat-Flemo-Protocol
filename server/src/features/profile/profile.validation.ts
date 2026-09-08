import { z } from "zod";

export const updateProfileSchema = z
  .object({
    heightCm: z.number().positive().max(300).optional(),
    estimatedBaselineTdee: z.number().positive().max(10000).optional(),
  })
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
