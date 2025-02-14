import userService, {UserService} from "../services/user.service"
import {NextFunction, Request, Response} from "express";
import {RegisterReqDto} from "../dtos/auth/register-req.dto";

export class UserController {
    constructor(private userService: UserService) {}

    async register(req: Request, resp: Response, next: NextFunction) {
        const dto: RegisterReqDto = req.body
        try {
            await this.userService.register(dto);
            resp.status(201).json()
        }
        catch (error) {
            next(error)
        }
    }
}

export default new UserController(userService)