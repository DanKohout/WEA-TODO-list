const app = require('./app')
const port = process.env.PORT || 3000
const auth = require('./middleware/authentication').jsonAuth
const Task = require('./models/task')

/**
 * This function only prints the port number
 */
app.listen(port, () => {
    console.log('Server is up on port' + port)
})

const hbs = require('hbs')
const path = require('path')
const express = require('express')

const publicDirectoryPath = path.join(__dirname, '../src/public')
const viewsPath = path.join(__dirname, '../src/templates/')
const partialsPath = path.join(__dirname, '../src/templates/partials/')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)



app.use(express.static(publicDirectoryPath))


/**
 * Those functions defines what to call if the given path is writen in url
 */
app.get('', (req, res) => {
    res.status(200).render('index', {
        title: 'TODO-list app', 
        name: 'Daniel Kohout'
    })
})


app.get('/login', (req, res) => {
    res.status(200).render('login', {
        title: 'Log in', 
        name: 'Daniel Kohout'
    })
})

app.get('/signup', (req, res) => {
    res.status(200).render('signup', {
        title: 'Sign up', 
        name: 'Daniel Kohout'
    })
})

app.get('/notes', (req, res) => {
    res.status(200).render('notes', {
        title: 'TODO-list', 
        name: 'Daniel Kohout'
    })
})

app.get('/json', auth, async (req, res) => {
    console.log('GET json starting')
    const tasks = await Task.find({author: req.user._id}, '-_id -author -__v').lean().exec()
    delete tasks["id"]
    console.log('TASKS:')
    console.log(tasks)
    res.status(200).json(tasks)
    console.log('GET json ended succesfuly')
})