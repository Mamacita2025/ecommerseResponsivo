// Importando os arquivos
import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto'
import {Mongo} from '../database/mongo.js'
import jwt from 'jsonwebtoken'
import {ObjectId} from 'mongodb'
import { text } from 'stream/consumers'
import { error } from 'console'

const collectionName = 'users'

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, callback) => {
    const user = await Mongo.db
    .collection(collectionName)
    .findOne({email: email})

    if (!user) {
        return callback(null, false)
    }

    const saltBuffer = user.salt.buffer

    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => {
        if (err) {
            return callback(err, false)
        }

        const userPassordBuffer = Buffer.from(user.password.buffer)

        if (!crypto.timingSafeEqual(userPassordBuffer, hashedPassword)) {
            return callback(null, false)
        }

        const { password, salt, ...rest } = user
        return callback(null, rest)
    } )
} ))

const authRouter = express.Router()

// Registrando os usuarios ou Criando usuario
authRouter.post('/signup', async (req, res) => {
    const checkUser = await Mongo.db
    .collection(collectionName)
    .findOne({email: req.body.email})

    if(checkUser) {
        return res.status(500).send({success: false,
            statuscode: 500,
            body: {
                text: 'User already exists!'
            }
        })
    }

    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
        if (err) {
              return res.status(500).send({success: false,
            statuscode: 500,
            body: {
                text: 'error on crypto password!',
                err: err
            }
        })
        }

        const result = await Mongo.db
        .collection(collectionName)
        .insertOne({
            email: req.body.email,
            password: hashedPassword,
            salt
        })

        if (result.insertedId) {
            const user = await Mongo.db
            .collection(collectionName)
            .findOne({_id: new ObjectId(result.insertedId)})

            const token = jwt.sign(user, 'secret')

            return res.send({
                success: true,
                statuscode: 200,
                body: {
                    text: 'Registado com sucesso!',
                    token,
                    user,
                    logged: true
                }
            })
        }
    })
})

authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user) => {
        if (error) {
            return res.status(500).send({
                success: false,
                statuscode: 500,
                body:{
                    text: 'Erro durante a autenticacao',
                    error
                }
            })
        }

        if (!user) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                body:{
                    text: 'credencias erradas!'
                }
            })
        }

        const token = jwt.sign(user, 'secret')
        return res.status(200).send({
            success: true,
            statuscode: 200,
            body: {
                text: 'Login realizado com sucesso',
                token,
                user,
                token
            }
        })  
    })(req, res) 
})

export default authRouter