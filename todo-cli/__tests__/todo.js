/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add } = todoList();

describe("ToDo test Suite", () => {
  test("Should add new todo", () => {
    expect(all.length).toBe(0);
    add({
      title: "todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-IN"),
    });
    expect(all.length).toBe(1);
  });
  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
});
