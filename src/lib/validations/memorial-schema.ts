import { z } from "zod";

export const memorialProfileSchema = z.object({
	fullName: z.string().min(1, "Full name is required"),
	dateOfBirth: z.string().min(1, "Date of birth is required"),
	dateOfDeath: z.string().min(1, "Date of death is required"),
	bio: z.string().optional(),
	country: z.string().min(1, "Country is required"),
	city: z.string().min(1, "City is required"),
	relation: z.string().min(1, "Relation is required"),
	privacySetting: z.enum(["public", "private"]),
});

export type MemorialProfileFormData = z.infer<typeof memorialProfileSchema>;
