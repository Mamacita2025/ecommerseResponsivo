import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";

const collectionName = 'plates'

export default class PlatesDataAcess {
    // Pegando os Produtos
    async getPlates() {
        const result = await Mongo.db
            .collection(collectionName)
            .find({})
            .toArray()

        return result
    }

    // Filtrando os Produtos 
       async getAvailablePlates() {
        const result = await Mongo.db
            .collection(collectionName)
            .find({ available: true })
            .toArray()

        return result
    }

    // Adicionando Produtos 
    async addPlate(plateData){
        const result = await Mongo.db
        .collection(collectionName)
        .insertOne(plateData)

        return result
    }

    // Eliminado Produtos 
    async deletePlate(plateId) {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(plateId) })

        return result
    }

    // Atualizando Produtos 
    async updatePlate(plateId, plateData) {
    
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(plateId) },
                { $set: plateData }
            )

        return result
    }

    
}