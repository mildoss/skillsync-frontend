import * as z from "zod";
import { EmploymentType, VacancyType } from "@/types/enums";

const urlField = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/.test(val), "Must be a valid URL");

const emptyToUndefined = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

const numberOrEmpty = z.coerce
  .number()
  .optional()
  .or(z.literal("").transform(() => undefined));

const aboutSchema = z
  .string()
  .min(20, "Tell us a bit more about yourself (min 20 chars)")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const updateEmployerProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().optional(),
  about: z.string().optional(),
  avatarUrl: urlField,
});

export const updateApplicantProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position must be at least 2 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  experience: numberOrEmpty,
  location: emptyToUndefined,
  about: aboutSchema,
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  workFormats: z.array(z.enum(VacancyType)).default([]),
  employmentTypes: z.array(z.enum(EmploymentType)).default([]),
  avatarUrl: urlField,
  cvUrl: urlField,
  isActive: z.boolean().default(true),
});

export type UpdateEmployerProfileInput = z.infer<typeof updateEmployerProfileSchema>;
export type UpdateApplicantProfileInput = z.infer<typeof updateApplicantProfileSchema>;
export type ApplicantProfileFormValues = z.input<typeof updateApplicantProfileSchema>;
export type ApplicantProfileData = z.output<typeof updateApplicantProfileSchema>;