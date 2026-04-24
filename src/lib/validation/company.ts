import * as z from "zod";

const urlField = z
  .string()
  .trim()
  .transform((val) => (val === "" ? undefined : val))
  .optional()
  .refine((val) => !val || /^https?:\/\/.+/.test(val), "Must be a valid URL");

export const createCompanySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  logoUrl: urlField,
  websiteUrl: urlField,
  companyType: z.enum(["PRODUCT", "OUTSOURCE", "OUTSTAFF", "STARTUP", "AGENCY"], {
    error: "Please select a company type",
  }),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
