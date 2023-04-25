/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require("express");
const app = express();
var csrf = require("tiny-csrf");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
const path = require("path");
const { Todo, User } = require("./models");
const todo = require("./models/todo");
const passport = require("passport");
const localStrategy = require("passport-local");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const bcrypt = require("bcrypt");
//const user = require("./models/user");
const { error } = require("console");
const saltRounds = 10;

app.use(
  session({
    secret: "my-super-secret-key-1239876541583515",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passportField: "passport",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) return done(null, user);
          else return done("Invalid Password!");
        })
        .catch((error) => {
          return done("Invalid User");
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(null, error);
    });
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));

app.set("view engine", "ejs");
app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const loggedInUser = request.user.id;
    const overDueTodos = await Todo.getOverdueTodos(loggedInUser);
    const dueLaterTodos = await Todo.getDueLaterTodos(loggedInUser);
    const dueTodayTodos = await Todo.getDueTodayTodos(loggedInUser);
    const completedTodos = await Todo.getCompletedTodos(loggedInUser);
    if (request.accepts("html")) {
      response.render("todos", {
        overDueTodos,
        dueLaterTodos,
        dueTodayTodos,
        completedTodos,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({
        completedTodos,
        dueLaterTodos,
        dueTodayTodos,
        overDueTodos,
      });
    }
  }
);

app.get("/", async (request, response) => {
  try {
    //const todoslist = await Todo.findAll();
    response.render("index", { csrfToken: request.csrfToken() });
    //return response.json(todoslist);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/login", async (request, response) => {
  response.render("login", { csrfToken: request.csrfToken() });
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  async (request, response) => {
    response.redirect("/todos");
  }
);

app.post("/signup", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
  console.log(hashedPwd);

  try {
    const user = await User.addUser({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.logIn(user, (err) => {
      //console.log(user);
      if (err) console.log("error!!!!!!!");
      response.redirect("/todos");
    });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get(
  "/signout",
  connectEnsureLogin.ensureLoggedIn(),
  (request, response, next) => {
    request.logOut((err) => {
      if (err) return next(err);
      response.redirect("/");
    });
  }
);

app.get("/signup", async (request, response) => {
  response.render("signup", { csrfToken: request.csrfToken() });
});

app.get(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("creating new todo", request.body);
    console.log(request.user);
    try {
      await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        completed: request.body.completed ? request.body.completed : false,
        userId: request.user.id,
      });
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("Mark Todo as completed:", request.params.id);
    const todo = await Todo.findByPk(request.params.id);
    try {
      const updatedtodo = await todo.setCompletionStatus(
        request.body.completed
      );
      return response.json(updatedtodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);
app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("delete a todo with ID:", request.params.id);
    const todo = await Todo.findByPk(request.params.id);
    if (todo.userId === request.user.id) {
      try {
        await todo.destroy();
        return response.json({ success: true });
      } catch (error) {
        return response.status(422).json(error);
      }
    }
  }
);
module.exports = app;
