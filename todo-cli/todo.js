/* eslint-disable no-undef */
const todoList = () => {
  const all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    // Write the date check condition here and return the array
    // of overdue items accordingly.
    return all.filter((task) => {
      return task.dueDate === yesterday;
    });
  };

  const dueToday = () => {
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    return all.filter((task) => {
      return task.dueDate === today;
    });
  };

  const dueLater = () => {
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    return all.filter((task) => {
      return task.dueDate === tomorrow;
    });
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    let out = "";
    list.forEach((task) => {
      if (task.completed === true) {
        out = out.concat("[x]");
      } else {
        out = out.concat("[ ]");
      }
      out = out.concat(" " + task.title);
      if (task.dueDate !== today) {
        out = out.concat(" " + task.dueDate);
      }
      out = out.concat(",");
    });
    out = out.substring(0, out.length - 1);
    out = out.replace(",", "\n");
    return out;
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

var dateToday = new Date();
const today = formattedDate(dateToday);
const yesterday = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() - 1))
);
const tomorrow = formattedDate(
  new Date(new Date().setDate(dateToday.getDate() + 1))
);

module.exports = todoList;
