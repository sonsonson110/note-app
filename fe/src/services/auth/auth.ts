import { axiosInstance } from '../../lib/axios'
import { LoginReqDto } from './dto/loginReqDto'
import { LoginRespDto } from './dto/loginRespDto'

export const authApi = {
    login: async (dto: LoginReqDto): Promise<LoginRespDto> => {
      const { data } = await axiosInstance.post('api/auth/login', dto)
      return data
    },
    logout: async () => {
      const { data } = await axiosInstance.post('api/auth/logout')
      return data
    },
    refreshToken: async (): Promise<LoginRespDto> => {
      const { data } = await axiosInstance.post('api/auth/refresh')
      return data
    }
  }