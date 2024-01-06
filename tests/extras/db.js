const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

/**
 * There are created users and tasks to create testing environment
 */

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike', 
    email: 'mike@example.com', 
    password: 'mysuperPasswd007/', 
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}


const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Mike2', 
    email: 'mike2@example.com', 
    password: 'myPasswd004/', 
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(), 
    description: 'First task', 
    completed: false, 
    author: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(), 
    description: 'Second task', 
    completed: true, 
    author: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(), 
    description: 'Third task', 
    completed: false, 
    author: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()  
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId, userOne, setupDatabase, userTwoId, userTwo, taskOne, taskTwo, taskThree
}
