import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";

const collectionName = 'orders'

export default class OrderDataAcess {
    // Pegando os order
    async getOrder() {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([

                // order feito 
                {
                    $lookup:{
                        from: 'orderItems',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderItems'
                    }
                },
                // Quem fez o order?
                {
                    $lookup:{
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                // Ocultando dados senciveis 
                {
                    $project: {
                        'userDetails.password': 0,
                        'userDetails.salt': 0,
                    }
                },
                // Pegando dados pedidos dos Usuarios 
                {
                    $unwind: '$orderItems'
                },
                {
                    $lookup: {
                        from: 'plates',
                        localField: 'orderItems.plateId',
                        foreignField: '_id',
                        as: 'orderItems.itemDetails'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        userDetails: {$first: '$userDetails'},
                        orderItems: {$push: '$orderItems'},
                        pickupStatus: {$first: '$pickupStatus'},
                        pickupTime: {$first: '$pickupTime'},
                    }
                }
            ])
            .toArray()

        return result
    }

        async getOrdersByUserId(userId) {
        const result = await Mongo.db
            .collection(collectionName)
            .aggregate([
                {
                    $match: {userId: new ObjectId(userId)}
                },

                // order feito 
                {
                    $lookup:{
                        from: 'orderItems',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'orderItems'
                    }
                },
                // Quem fez o order?
                {
                    $lookup:{
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                // Ocultando dados senciveis 
                {
                    $project: {
                        'userDetails.password': 0,
                        'userDetails.salt': 0,
                    }
                },
                // Pegando dados pedidos dos Usuarios 
                {
                    $unwind: '$orderItems'
                },
                {
                    $lookup: {
                        from: 'plates',
                        localField: 'orderItems.plateId',
                        foreignField: '_id',
                        as: 'orderItems.itemDetails'
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        userDetails: {$first: '$userDetails'},
                        orderItems: {$push: '$orderItems'},
                        pickupStatus: {$first: '$pickupStatus'},
                        pickupTime: {$first: '$pickupTime'},
                    }
                }
            ])
            .toArray()

        return result
    }


    // Adicionando order 
    async addOrder(orderData){
        const { items, ...orderDataRest } = orderData

        orderDataRest.createdAt = new Date()
        orderDataRest.pickupStatus = 'pending'
        orderDataRest.userId = new ObjectId(orderDataRest.userId)

        const newOrder = await Mongo.db
        .collection(collectionName)
        .insertOne(orderDataRest)

        if(!newOrder.insertedId){
            throw new Error('Order nao foi inserida');
            
        }

        items.map((item) => {
            item.plateId = new ObjectId(item.plateId)
            item.orderId = new ObjectId(newOrder.insertedId)
        })

        const result = await Mongo.db
        .collection('orderItems')
        .insertMany(items)

        return result
    }

    // Eliminado order 
    async deleteOrder(orderId) {

        const itemsToDelete = await Mongo.db
        .collection(collectionName)
        .deleteMany({orderId: new ObjectId(orderId)})

        const orderToDelete = await Mongo.db
            .collection(collectionName)
            .findOneAndDelete({ _id: new ObjectId(orderId) })

        const result = {
            itemsToDelete,
            orderToDelete
        }

        return result
    }

    // Atualizando order 
    async updateOrder(orderId, orderData) {
    
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(orderId) },
                { $set: orderData }
            )

        return result
    }

    
}