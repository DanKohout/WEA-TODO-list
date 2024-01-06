const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, setupDatabase} = require('./extras/db')

/**
 * Create same environment for testing
 */
beforeEach( async () => {
    await setupDatabase()
})

/**
 * This test tries if it is possible to signup a new user
 */
test('Should signup a new user', async() => {
    const response = await request(app).post('/users').send({
        name: 'Simon',
        email: 'sim@email.com',
        password: 'mysuper007/'
    }).expect(201) 

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Simon',
            email: 'sim@email.com'
        }, 
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('mysuper007')

})

/**
 * This test tries if it is possible login existing user
 */
test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email, 
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)

})

/**
 * This test tries if it is possible to login not existing user
 */
test('Should login not existing user', async() => {
    await request(app).post('/users/login').send({
        email: 'bad@email.com',
        password: 'mybadPasswd007/'
    }).expect(400)
})

/**
 * This test tries if it is possible to get informations about the user
 */
test('Should get profile for user', async() => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

/**
 * This test tries if it is possible to get the profile for unauthenticated user
 */
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

/**
 * This test tries if it is possible to delete the user account
 */
test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

/**
 * This test tries if it is possible to delete account of unauthenticated user
 */
test('Should not delete account for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

/**
 * This test tries if it is possible to update allowed user fields
 */
test('Should update valid user fields', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'Jess'
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jess')
})

/**
 * This test tries if it is possible to update not allowed user fields
 */
test('Should not update invalid user fields', async() => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'Boston'
    }).expect(400)
    
})
