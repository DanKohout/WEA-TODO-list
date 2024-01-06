const express = require('express')
const auth = require('../middleware/authentication').auth
const Task = require('../models/task')
const striptags = require('striptags')
const router = new express.Router()

/**
* This function creates new task, deletes all dangerous code and sends it to the server
*/
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body, 
        author: req.user._id
    })  
    try{
        task.description = striptags(String(task.description))
        
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

/**
* This function sends request get the tasks, all or completed/ not completed
*/
router.get('/tasks', auth, async (req, res) => {
    var tasks
    if(req.query.completed){
        tasks = await Task.find({author: req.user._id, completed: req.query.completed})
    }else{
        tasks = await Task.find({author: req.user._id})
    }
    try{        
        res.send(tasks)
    }catch(e){
        res.status(500).send(e) 
    }
})

/**
* This function sends request to get specific task
*/
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id 

    try{
        const task = await Task.findOne({_id, author: req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){

        res.status(500).send(e)
    }
})

/**
* This function sends valid data to modify task using the task id
*/
router.patch('/tasks/:id', auth, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }
    try{
        function modifyToSave(req) {
            if(Object.keys(req.body).includes("description")){
                req.body.description= striptags(String(req.body.description))
            }if(Object.keys(req.body) .includes("completed")){
                req.body.completed = striptags(String(req.body.completed))
            }
        }modifyToSave(req)

        const task = await Task.findOne({_id: req.params.id, author: req.user._id})    
            if(!task){
                return res.status(404).send()
            }
            updates.forEach((update) => {
                task[update] = req.body[update]
            })
            await task.save()
            res.send(task)
           

    }catch(e){
        res.status(400).send(e)
    }
})

/**
* This function deletes the task, by its id
*/
router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, author: req.user._id})
        
        if(!task){
            res.send(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})


module.exports = router