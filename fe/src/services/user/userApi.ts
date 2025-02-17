import { axiosInstance } from "../../lib/axios"
import { SignupUserDto } from "./dto/signupUserDto"

export const userApi = {
    signup: async (dto: SignupUserDto) => {
        await axiosInstance.post('api/users', dto)
    }
}