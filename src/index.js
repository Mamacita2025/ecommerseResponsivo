import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { Mongo } from './database/mongo.js'
import mongoose from 'mongoose'
import authRouter from './auth/auth.js'

config()
async function main() {
    const hostName = 'localhost'
    const port = 8081

    const app = express()

    mongoose.Promise = global.Promise
    mongoose.connect("mongodb://localhost:27017/news", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("MongoDB Conectado...!")
    }).catch((err) => {
        console.log("Houve em erro", + err)
    })

   const mongoConnection = await Mongo.connect({mongoConnectionString: process.env.MONGO_CS, mongoDbName: process.env.MONGO_DB_NAME})

   console.log(mongoConnection)
    app.use(express.json())
    app.use(cors())

    app.get('/', (req, res) => {
        res.send('Ola mundo luis')
    })

    app.use('/auth', authRouter)
    app.listen(port, () => {
        console.log(`Servidor rodando na porta: http://${hostName}:${port}`)
    })
}
main()