import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.userService.register(req.body);
      res.status(201).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.userService.login(req.body);
      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getUserById(
        req.user!.id,
        req.user!.role,
        req.params.id as string
      );
      res.status(200).json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers(req.user!.role);
      res.status(200).json({ status: "success", data: users });
    } catch (error) {
      next(error);
    }
  };

  toggleBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.toggleBlock(
        req.user!.id,
        req.user!.role,
        req.params.id as string
      );
      res.status(200).json({ status: "success", data: user });
    } catch (error) {
      next(error);
    }
  };
}
