import { z } from  "zod";
import { ErreurMessages } from "../utils/errorMessage.js";

export const CreateUserSchema = z.object({
    email: z.string().email().min(2, ErreurMessages.missingEmail),
    password: z.string().min(2, ErreurMessages.missingPassword),
    name: z.string().min(2, ErreurMessages.missingName),
    role: z.enum(["USER", "ADMIN"], { error: ErreurMessages.missingRole })
})
export const updateCUserSchema = CreateUserSchema.partial();
