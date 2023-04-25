/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({ title, dueDate, completed: false, userId });
    }

    static async getTodoList() {
      return this.findAll();
    }

    setCompletionStatus = async function (completed) {
      this.completed = completed;
      await this.save();
      return this;
    };

    static async getCompletedTodos(userId) {
      return this.findAll({
        where: {
          completed: true,
          userId,
        },
        order: [["id", "ASC"]],
      });
    }

    static async getOverdueTodos(userId) {
      return this.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
          completed: false,
          userId,
        },
        order: [["id", "ASC"]],
      });
    }

    static async getDueTodayTodos(userId) {
      const today = new Date();
      return this.findAll({
        where: {
          dueDate: {
            [Op.gte]: today,
            [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
          completed: false,
          userId,
        },
        order: [["id", "ASC"]],
      });
    }

    static async getDueLaterTodos(userId) {
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
          completed: false,
          userId,
        },
        order: [["id", "ASC"]],
      });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
