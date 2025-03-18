import { axiosInstance } from "../../lib/axios"

export const notebookApi = {
    getUserNotebooks: async () => {
        await axiosInstance.get('api/notebooks')
    }
}