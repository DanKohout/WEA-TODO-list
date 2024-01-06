const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * This function compares the given token with the token saved in the database and if they are the same
 * it allows user to log in 
 */
const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: 'Please authenticate...'})
    }
}

/**
 * This function compares the given token with the token saved in the database and if they are the same
 * it allows to display the data - tasks in JSON format
 */
const jsonAuth = async (req, res, next) => {
    try{
        const token = req.headers.cookie.split("token=")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }catch(e) {
        res.status(401).send({error: 'Please authenticate...'})
    }
}
module.exports.jsonAuth = jsonAuth
module.exports.auth = auth