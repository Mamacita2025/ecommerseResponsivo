import PlatesDataAcess from "../dataAcess/plates.js"
import { ok, serverError } from "../helpers/httpResponse.js";


export default class PlatesControllers {
    constructor() {
        this.dataAccess = new PlatesDataAcess()
    }

    // Pegando Produtos
    async getPlates(){
        try {
            const plates = await this.dataAccess.getPlates()
            return ok(plates)
        } catch (error) {
            return serverError(error)
        }
    }

    // Filtrando Produtos
      async getAvailablePlates(){
        try {
            const plates = await this.dataAccess.getAvailablePlates()
            return ok(plates)
        } catch (error) {
            return serverError(error)
        }
    }

    async addPlate(plateData){
        try {
            const result = await this.dataAccess.addPlate(plateData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    // Deletando Produtos
    async deletePlate(plateId){
        try {
            const result = await this.dataAccess.deletePlate(plateId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updatePlate(plateId, plateData){
        try {
            const result = await this.dataAccess.updatePlate(plateId, plateData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}