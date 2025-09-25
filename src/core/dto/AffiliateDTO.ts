import { z } from "zod";

export const AffiliateDTO = z.object({
    firstName: z.string().min(2).max(100),
    middleName: z.string().min(0).max(100),
    firstLastName: z.string().min(2).max(100),
    secondLastName: z.string().min(2).max(100),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    identificationNumber: z.string().min(2).max(100),
    identificationType: z.string().min(2).max(100),
    department: z.string().min(2).max(100),
    municipality: z.string().min(2).max(100)
});