/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict';
const { Model, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title, dueDate, completed: false });
    }

    static async getTodoList() {
      return this.findAll();
    }

    setCompletionStatus = async function(completed) {
      this.completed = completed;
      await this.save();
      return this
    };
    

    static async getCompletedTodos() {
      return this.findAll({
        where: { completed: true },
        order: [['id', 'ASC']],
      });
    }

    static async getOverdueTodos() {
      return this.findAll({
        where: {
          dueDate: { [Op.lt]: new Date() },
          completed: false,
        },
        order: [['id', 'ASC']],
      });
    }

    static async getDueTodayTodos() {
      const today = new Date();
      return this.findAll({
        where: {
          dueDate: {
            [Op.gte]: today,
            [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
          completed: false,
        },
        order: [['id', 'ASC']],
      });
    }

    static async getDueLaterTodos() {
      return this.findAll({
        where: {
          dueDate: { [Op.gt]: new Date() },
          completed: false,
        },
        order: [['id', 'ASC']],
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
      modelName: 'Todo',
    }
  );

  return Todo;
};
