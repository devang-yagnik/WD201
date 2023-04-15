/* eslint-disable no-undef */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname,'public')))

app.get("/", async (request, response) => {
  const overDueTodos = await Todo.overdue()
  const dueTodayTodos = await Todo.dueToday()
  const dueLaterTodos = await Todo.dueLater()
  const completedTodos = await Todo.completed()
  if(request.accepts("html")){
    response.render('index', {
      overDueTodos, dueTodayTodos, dueLaterTodos, completedTodos
    })
  }
  else{
    response.json(allTodos)
  }
})

app.get("/todos", async (request, response) => {
  // response.send("hello world")
  console.log("Todo list");
  const todoList = await Todo.getTodoList()
  return response.json(todoList)
});

// app.get("/todos/:id", async function (request, response) {
//   try {
//     const todo = await Todo.findByPk(request.params.id);
//     return response.json(todo);
//   } catch (error) {
//     console.log(error);
//     return response.status(422).json(error);
//   }
// });

app.post("/todos", async (request, response) => {
  console.log("creating a todo", request.body);
  try {
    // eslint-disable-next-line no-unused-vars
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
      completed: false,
    });
    response.redirect('/')
    // return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("We have to update a todo with ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.update({ completed: request.body.completed });
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});


app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by ID: ", request.params.id);
  // const todo = await Todo.findByPk(request.params.id);
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (todo) {
      await todo.delete();
      return response.json(true);
    } else {
      return response.json(false);
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(false);
  }
});

module.exports = app;
