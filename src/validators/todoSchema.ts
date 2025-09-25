import { z } from "zod";
import { ErrorMessages } from "../utils/errorMessage.js";

export const CreateTodoSchema = z.object({
    title: z.string().min(1, ErrorMessages.TODO_MISSING_TITLE),
    description: z.string().optional(),
    audiourl : z.string().optional(),
    completed: z.boolean().optional().refine((val) => val !== undefined, {
        message: ErrorMessages.TODO_MISSING_COMPLETED
    }),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: ErrorMessages.INVALID_DATE_DEBUT
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: ErrorMessages.INVALID_DATE_FIN
    })
});