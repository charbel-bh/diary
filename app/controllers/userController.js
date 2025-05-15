const User = require('../database/models/User')
const { compareSync } = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
    path: path.join(__dirname, '../../.env')
})

const userController = {

    async login(req, res) {
        const { email, password} = req.body

        try {
            const user = await User.findOne({
                where: { email }
            })

           const isPasswordValid = compareSync(password, user.password)
           
           if(isPasswordValid){
                    const token = jwt.sign({ email, role: user.role }, process.env.TOKEN_PRIVATE_KEY, {
                        expiresIn: "1h" //a modifier mettre un algorithme de chiffrement pour la clé modification de la date d'expiration
                    })

                return res.status(200).json({ token })
                }

                return res.status(400).json({ message : "Bad Request" })

        } catch (err) {
            return res.status(500).json({ err })
        }

    },

    async store(req, res){

        const { firstName, lastName, email, password  } = req.body

        try {
            const user = await User.create({ firstName, lastName, email, password })
            return res.status(201).json({user})

        }catch(err){
            console.trace( err )
            return res.status(500).json({ err })

        }

    },

    async getOneByEmail() {
        
            const { decodedToken } = req
            
            if(!decodedToken)  {
            return resizeBy.status(401).json({ message: "no decoded token"})
            }

            const { email } = decodedToken

        
        try {

            const user = await User.findOne({
                where: {
                    email: email
                }
            })

            if(!user) {
                return res.status(404).json({ message: "no user found with email" + email })
            }
            return res.status(200).json({ user })

        } catch(err) {
            return res.status(500).json({ err })
        }
    }
}

module.exports = userController