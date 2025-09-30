import { z } from 'zod';

const RichTextNode: z.ZodType<unknown> = z.lazy(() =>
    z.object({
        nodeType: z.string(),
        value: z.string().optional(),
        data: z.record(z.any()),
        content: z.array(RichTextNode).optional(), // hijo opcional
    })
);

export const RichTextNodeDTO = RichTextNode;