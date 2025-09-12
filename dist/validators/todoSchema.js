import { z } from "zod";
import { ErreurMessages } from "../utils/errorMessage.js";
export const CreateTodoSchema = z.object({
    title: z.string().min(1, ErreurMessages.missingTodoTitle),
    completed: z.boolean().optional().refine((val) => val !== undefined, {
        message: ErreurMessages.missingTodoCompleted
    })
});
//# sourceMappingURL=todoSchema.js.map