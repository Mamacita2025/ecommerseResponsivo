import UserDataAcess from "../dataAcess/users.js";
import { ok, serverError } from "../helpers/httpResponse.js";

export default class UsersControllers {
    constructor() {
        this.dataAccess = new UserDataAcess()
    }

    // Pegando usuarios
    async getUsers(){
        try {
            const users = await this.dataAccess.getUsers()
            return ok(users)
        } catch (error) {
            return serverError(error)
        }
    }

    // Deletando Usuarios
    async deleteUser(userId){
        try {
            const result = await this.dataAccess.deleteUser(userId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updateUser(userId, userData){
        try {
            const result = await this.dataAccess.updateUser(userId, userData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}