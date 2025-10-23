import { z } from "zod";

export const TurnReportDataDTO = z.object({
    content: z.array(
        z.object({
            id: z.number(),
            turnCode: z.string().min(2).max(100),
            identificationType: z.string().max(50),
            identificationNumber: z.string().max(50),
            firstName: z.string().min(2).max(100),
            lastName: z.string().min(2).max(100),
            attentionService: z.string().nullable(),
            classificationAttention: z.string().min(2).max(100),
            assignedDate: z.string().min(2).max(100),
            attendedDate: z.string().min(0).max(100).nullable(),
            attentionTime: z.string().min(0).max(100).nullable(),
            department: z.string().min(2).max(100),
            lastAttendedDate: z.string().min(0).max(100).nullable(),
            municipality: z.string().min(2).max(100),
            totalAttentionTime: z.string().min(0).max(100).nullable(),
            userProcess: z.string().min(0).max(100).nullable(),
            waitingTime: z.string().min(0).max(100).optional(),
        })
    )
});