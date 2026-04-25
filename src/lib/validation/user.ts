import * as z from "zod";

const urlField = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/.test(val), "Must be a valid URL");

export const updateEmployerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().optional(),
  about: z.string().optional(),
  avatarUrl: urlField,
});

export type UpdateEmployerProfileInput = z.infer<typeof updateEmployerProfileSchema>;