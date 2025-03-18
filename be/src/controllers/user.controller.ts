import userService, {UserService} from "../services/user.service"
import {NextFunction, Request, Response} from "express";
import {SignupReqDto} from "../dtos/auth/signup-req.dto";

export class UserController {
    constructor(private userService: UserService) {}

    async signup(req: Request, resp: Response, next: NextFunction) {
        const dto: SignupReqDto = req.body
        try {
            await this.userService.signup(dto);
            resp.status(201).json()
        }
        catch (error) {
            next(error)
        }
    }
}

export default new UserController(userService)