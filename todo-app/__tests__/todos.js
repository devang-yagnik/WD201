/* eslint-disable no-undef */
const request = require("supertest");
var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");
let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo test suite ", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force:true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("sign up", async () => {
    let res = await agent.get("/signup")
    const csrfToken = extractCsrfToken(res) ;
    res = await agent.post("/signup").send({    
      firstName: "Test" ,
      lastName: "User A" ,
      email: "user.a@test. com" ,
      password: "12345678" ,
      _csrf: csrfToken,
    })
    expect(res.statusCode).toBe(302)
  })

  test("Create new todo", async () => {
    const res = await agent.get("/todos");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Go to movie",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Mark todo as complete", async () => {
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const gropuedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueTodayTodos.length;
    const latestTodo = parsedGroupedResponse.dueTodayTodos[dueTodayCount - 1];
    const status = latestTodo.completed ? false : true;
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const response = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: status,
    });
    const parsedUpdateResponse = JSON.parse(response.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Mark todo as incomplete", async () => {
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: true,
      _csrf: csrfToken,
    });
    const gropuedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text);
    const completedTodosCount = parsedGroupedResponse.completedTodos.length;
    const latestTodo = parsedGroupedResponse.completedTodos[completedTodosCount - 1];
    const status = latestTodo.completed ? false : true;
    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);
  
    console.log("latestTodo.completed", latestTodo.completed);
    console.log("status", status);
    const response = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
      completed: status,
    });

    const parsedUpdateResponse = JSON.parse(response.text);
    expect(parsedUpdateResponse.completed).toBe(false);
  });

  test(" Delete todo using ID", async () => {
    let res = await agent.get("/todos");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/todos").send({
      title: "Go to shopping",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    const gropuedTodosResponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(gropuedTodosResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueTodayTodos.length;
    const latestTodo = parsedGroupedResponse.dueTodayTodos[dueTodayCount - 1];

    res = await agent.get("/todos");
    csrfToken = extractCsrfToken(res);

    const response = await agent.put(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken,
    });
    const parsedUpdateResponse = JSON.parse(response.text);
    expect(parsedUpdateResponse.completed);
  });
});