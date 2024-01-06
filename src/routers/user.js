const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/authentication').auth
const striptags = require('striptags')
const router = new express.Router()

/**
* This function creates new user with provided name, email and password
* the given values are also checked if they do not contain dangerous code, if they do,
* the dangerous code is removed
*/
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        user.name = striptags(String(user.name))
        user.email = striptags(String(user.email))
        user.password = striptags(String(user.password))
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(e){
        res.status(400).send(e)
    }
})

/**
* This function loggs in user with his email and password
* the given values are also checked if they do not contain dangerous code, if they do,
* the dangerous code is removed
*/
router.post('/users/login', async (req, res) => {
    try{
        req.body.email = striptags(String(req.body.email))
        req.body.password = striptags(String(req.body.password))
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

/**
* This function loggs out the user that is logged in
*/
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

/**
* This function loggs out all the users
*/
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

/**
* This function gets the informations about the user that is logged in
*/
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

/**
* This function updates the user informations
*/
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})


/**
* This function deletes the user that is logged in
*/
router.delete('/users/me', auth, async(req, res) => {
    try{
        console.log(req.user)
        await req.user.remove()
        console.log('await is done')
        res.send(req.user)
    }catch(e){
        res.status(500).send()
        console.log('user delete failed')
    }
})


module.exports = router