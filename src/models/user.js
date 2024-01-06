const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    }, 
    email: {
        type: String, 
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String, 
        required: true,
        trim: true, 
        minlength: 7
    }, 
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }], 
}, {
    timestamps: true, 
    toJSON: {virtuals: true}

})

/**
 * Creating the connection between user and his task
 */
userSchema.virtual('tasks', {
    ref: 'Task', 
    localField: '_id', 
    foreignField: 'author'
})

/**
 * This function generates the auth. token using JWT_SECRET
 */
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

/**
 * This function returns only the necessary informations 
 */
userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

/**
 * This function tries to log in the user with his email and password
 */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

/**
 * This function uses bcrypt to hash the password
 */
userSchema.pre('save', async function(next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    
    next()
})

/**
 * This function deletes tasks from removed user
 */
userSchema.pre('remove', async function (next) {
    console.log('in remove')
    const user = this
    console.log('in remove, starting deleting tasks')
    await Task.deleteMany({author: user._id})
    console.log('tasks deleted')
    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User