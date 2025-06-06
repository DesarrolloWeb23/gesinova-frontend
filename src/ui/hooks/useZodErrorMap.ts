import { getMessage } from "@/core/domain/messages";

export const customZodErrorMap: Parameters<typeof import("zod").setErrorMap>[0] = (
    issue,
    ctx
) => {
    const key = `${issue.code}_${issue.path[0]}`.toLowerCase(); // example: required_email
    const msg = getMessage("errors", key) || ctx.defaultError;
    return { message: msg };
};