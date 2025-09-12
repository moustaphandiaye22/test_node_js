import { z } from "zod";
import { ErreurMessages } from "../utils/errorMessage.js";


export const historiqueSchema = z.object({
    action: z.string().min(2, ErreurMessages.missingAction),
    userId: z.number().min(1, ErreurMessages.missingUserId),
    todoId: z.number().min(1, ErreurMessages.missingTodoId),
    timestamp: z.string().min(2, ErreurMessages.missingTimestamp)
})

export type HistoriqueInput = z.infer<typeof historiqueSchema>;