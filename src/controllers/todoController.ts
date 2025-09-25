import type { Request, Response } from "express";
import { HistoriqueService } from "../services/historiqueService.js";
import { ErrorMessages } from "../utils/errorMessage.js";
import { HttpStatus } from "../utils/httpStatus.js";
import { TodoService } from "../services/todoService.js";
import { NotificationService } from "../services/notificationService.js";
import { UserRepository } from "../repositories/userRepository.js";
import { CreateTodoSchema } from "../validators/todoSchema.js";

const mnservice = new TodoService();
const notificationService = new NotificationService();
const userRepository = new UserRepository();
const historiqueService = new HistoriqueService();

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}
export class todoController {
  static async archive(req: AuthenticatedRequest, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const todo = await mnservice.findTodoById(id);
      if (!todo) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: ErrorMessages.TODO_NOT_FOUND });
      }
      const updated = await mnservice.updateTodo(id, { archived: true });
      await historiqueService.create({
        userId: typeof req.user?.id === "number" ? req.user.id : -1,
        action: "ARCHIVE",
        todoId: id,
        timestamp: new Date(),
      });
      res.json(updated);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async unarchive(req: AuthenticatedRequest, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const todo = await mnservice.findTodoById(id);
      if (!todo) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: ErrorMessages.TODO_NOT_FOUND });
      }
      const updated = await mnservice.updateTodo(id, { archived: false });
      await historiqueService.create({
        userId: typeof req.user?.id === "number" ? req.user.id : -1,
        action: "UNARCHIVE",
        todoId: id,
        timestamp: new Date(),
      });
      res.json(updated);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
  static async share(req: AuthenticatedRequest, res: Response) {
    try {
      const todoId: number = Number(req.params.id);
      const { userId, canEdit, canDelete } = req.body;
      if (!userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: ErrorMessages.TODO_USERID_REQUIRED });
      }
      const todo = await mnservice.findTodoById(todoId);
      if (!todo) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: ErrorMessages.TODO_NOT_FOUND });
      }
      // Seul le propriétaire peut partager
      if (todo.userId !== req.user?.id) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ error: ErrorMessages.TODO_OWNER_ONLY_SHARE });
      }
      const share = await mnservice.shareTodo(
        todoId,
        userId,
        !!canEdit,
        !!canDelete
      );
      await historiqueService.create({
        userId: req.user?.id,
        action: "SHARE",
        todoId: todoId,
        timestamp: new Date(),
      });
      res.status(HttpStatus.CREATED).json(share);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
  static async complete(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const existing = await mnservice.findTodoById(id);
      if (!existing) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: ErrorMessages.TODO_NOT_FOUND });
      }
      const todo = await mnservice.updateTodo(id, { completed: true });
      await historiqueService.create({
        userId: todo.userId,
        action: "UPDATE",
        todoId: id,
        timestamp: new Date(),
      });
      // Récupère le todo avec les partages
      const todoWithShares = await mnservice.findTodoById(id);
      if (todoWithShares) {
        const todoWS: any = todoWithShares;
        const users = [todoWS.userId];
        const sharedUsers = todoWS.shares
          ? todoWS.shares.map((s: any) => s.userId)
          : [];
        const allUsers = Array.from(new Set([...users, ...sharedUsers]));
        const userObjs = await Promise.all(
          allUsers.map((uid) => userRepository.findById(uid))
        );
        await notificationService.notifyTaskCompleted(todo, userObjs);
      }
      res.json(todo);
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const todos = await mnservice.getAllTodos();
      const host = req.protocol + "://" + req.get("host");
      const todosWithUrls = todos.map((todo) => ({
        ...todo,
        imageUrl: todo.imageUrl
          ? todo.imageUrl.startsWith("http")
            ? todo.imageUrl
            : host + todo.imageUrl
          : null,
        audioUrl: todo.audioUrl
          ? todo.audioUrl.startsWith("http")
            ? todo.audioUrl
            : host + todo.audioUrl
          : null,
      }));
      res.json(todosWithUrls);
    } catch (error: any) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: ErrorMessages.SERVER_ERROR });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const id: number = Number(req.params.id);
      const mntodo = await mnservice.findTodoById(id);
      if (!mntodo) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ error: ErrorMessages.TODO_NOT_FOUND });
      }
      return res.json(mntodo);
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      // Parse les champs string venant de multipart/form-data
      const parsedBody = {
        ...req.body,
        completed: req.body.completed === "true" || req.body.completed === true,
      };
      const mndata = CreateTodoSchema.parse(parsedBody);
      // Gestion des fichiers
      let imageUrl = undefined;
      let audioUrl = undefined;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFile = files?.image?.[0];
      const audioFile = files?.audio?.[0];
      if (imageFile) imageUrl = `/assets/${imageFile.filename}`;
      if (audioFile) audioUrl = `/audio/${audioFile.filename}`;

      const todoData = {
        ...mndata,
        userId: req.user?.id,
        imageUrl,
        audioUrl,
        startDate: new Date(mndata.startDate),
        endDate: new Date(mndata.endDate),
      };
      const mntodo = await mnservice.createTodo(todoData);
      await historiqueService.create({
        userId: mntodo.userId,
        action: "CREATE",
        todoId: mntodo.id,
        timestamp: new Date(),
      });
      res.status(HttpStatus.CREATED).json(mntodo);
    } catch (error: any) {
      const errors = error.errors ?? [{ message: error.message }];
      res.status(HttpStatus.BAD_REQUEST).json({ errors });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const id: number = Number(req.params.id);
      // Parse les champs string venant de multipart/form-data
      const parsedBody = {
        ...req.body,
        completed: req.body.completed === "true" || req.body.completed === true,
      };
      const mndata = CreateTodoSchema.parse(parsedBody);
      // Gestion des fichiers
      let imageUrl = undefined;
      let audioUrl = undefined;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFile = files?.image?.[0];
      const audioFile = files?.audio?.[0];
      if (imageFile) imageUrl = `/assets/${imageFile.filename}`;
      if (audioFile) audioUrl = `/audio/${audioFile.filename}`;
      // Injecte le userId du token dans la modification
      const todoData: any = {
        ...mndata,
        userId: req.user?.id,
        startDate: new Date(mndata.startDate),
        endDate: new Date(mndata.endDate),
      };
      if (imageUrl) todoData.imageUrl = imageUrl;
      if (audioUrl) todoData.audioUrl = audioUrl;
      const mntodo = await mnservice.updateTodo(id, todoData);
      await historiqueService.create({
        userId: mntodo.userId,
        action: "UPDATE",
        todoId: mntodo.id,
        timestamp: new Date(),
      });
      // Notification si la tâche repasse en cours
      if (mntodo.completed === false) {
        const todoWithShares = await mnservice.findTodoById(id);
        if (todoWithShares) {
          const todoWS: any = todoWithShares;
          const users = [todoWS.userId];
          const sharedUsers = todoWS.shares
            ? todoWS.shares.map((s: any) => s.userId)
            : [];
          const allUsers = Array.from(new Set([...users, ...sharedUsers]));
          const userObjs = await Promise.all(
            allUsers.map((uid) => userRepository.findById(uid))
          );
          await notificationService.notifyTaskResumed(mntodo, userObjs);
        }
      }
      res.json(mntodo);
    } catch (error: any) {
      const errors = error.errors ?? [{ message: error.message }];
      res.status(HttpStatus.BAD_REQUEST).json({ errors });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const id: number = Number(req.params.id);
      await historiqueService.create({
        userId: typeof req.user?.id === "number" ? req.user.id : -1,
        action: "DELETE",
        todoId: id,
        timestamp: new Date(),
      });
      await mnservice.deleteTodo(id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error: any) {
      res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
  }
}
