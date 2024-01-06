const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOneId, userOne, setupDatabase, userTwoId, userTwo, taskOne, taskTwo, taskThree} = require('./extras/db')

/**
 * Create same environment for testing
 */
beforeEach( async () => {
    await setupDatabase()
})

/**
 * This test tries if it is possible create task for user
 */
test('Should create task for user', async () => {
    const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        description: 'From my test'
    }).expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

/**
 * This test tries if it is possible to fetch user tasks
 */
test('Should fetch user tasks', async() => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(response.body.length).toEqual(2)
})

/**
 * This test tries if it is possible to delte the other users tasks, that should not be possible
 */
test('Should not delete other users tasks', async() => {
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)

    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})