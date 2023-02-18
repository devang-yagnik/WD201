/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("ToDo test Suite", () => {
  beforeAll(() => {
    add({
      title: "Submit assignment",
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .split("T")[0],
      completed: false,
    });
    add({
      title: "Pay rent",
      dueDate: new Date().toISOString().split("T")[0],
      completed: true,
    });
    add({
      title: "Service Vehicle",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    add({
      title: "File taxes",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
      completed: false,
    });
    add({
      title: "Pay electric bill",
      dueDate: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0],
      completed: false,
    });
  });
  test("Should add new todo", () => {
    const count = all.length;
    add({
      title: "todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-IN"),
    });
    expect(all.length).toBe(count + 1);
  });
  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("Retrieves overdue items", () => {
    expect(overdue().length).toBe(1);
  });
  test("Retrieves due today items", () => {
    expect(dueToday().length).toBe(2);
  });
  test("Retrieves due later items", () => {
    expect(dueLater().length).toBe(2);
  });
});
