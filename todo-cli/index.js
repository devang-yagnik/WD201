const { connect } = require('./connectDB.js')
const Todo = require('./TodoModel.js')

const createTable = async () => {
  try {
    await connect()
    const todo = await Todo.create({
      title: 'First Item',
      dueDate: new Date(),
      completed: false,
    });
    console.log(`Created todo with ID : ${todo.id}`)
  } catch (error) {
    console.log(error)
  }
}

(async () => {
  await createTable()
})()