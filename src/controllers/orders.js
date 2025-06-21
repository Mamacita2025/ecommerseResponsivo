import OrderDataAcess from "../dataAcess/orders.js";
import { ok, serverError } from "../helpers/httpResponse.js";


export default class OrdersControllers {
    constructor() {
        this.dataAccess = new OrderDataAcess()
    }

    // Pegando Produtos
    async getOrders(){
        try {
            const orders = await this.dataAccess.getOrder()
            return ok(orders)
        } catch (error) {
            return serverError(error)
        }
    }

    async addOrder(orderData){
        try {
            const result = await this.dataAccess.addOrder(orderData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    // Deletando Produtos
    async deleteOrder(orderId){
        try {
            const result = await this.dataAccess.deleteOrder(orderId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updateOrder(orderId, orderData){
        try {
            const result = await this.dataAccess.updateOrder(orderId, orderData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}