import { expect } from "chai";
import { ethers } from "hardhat";
import { ToDoList } from "../typechain-types"; // Путь к сгенерированным типам

describe("ToDoList", function () {
  let toDoList: ToDoList;
  let owner: any;

  // Инициализация контракта перед запуском тестов
  before(async () => {
    [owner] = await ethers.getSigners();
    const ToDoListFactory = await ethers.getContractFactory("ToDoList");
    toDoList = await ToDoListFactory.deploy() as ToDoList;
  });

  describe("Deployment", function () {
    it("Should deploy with an empty task list", async function () {
      const taskCount = await toDoList.getTaskCount();
      expect(taskCount).to.equal(0); // Проверяем, что при развертывании нет задач
    });
  });

  describe("Task Management", function () {
    it("Should create a new task", async function () {
      const taskContent = "My first task";
      await toDoList.createTask(taskContent);

      const task = await toDoList.getTask(1);
      expect(task.id).to.equal(1);
      expect(task.content).to.equal(taskContent);
      expect(task.completed).to.equal(false);
    });

    it("Should toggle task completion", async function () {
      await toDoList.toggleCompleted(1);

      let task = await toDoList.getTask(1);
      expect(task.completed).to.equal(true);

      await toDoList.toggleCompleted(1);

      task = await toDoList.getTask(1);
      expect(task.completed).to.equal(false);
    });

    it("Should clear all tasks", async function () {
      await toDoList.createTask("Task 2");
      await toDoList.createTask("Task 3");

      await toDoList.clearTasks();

      const taskCount = await toDoList.getTaskCount();
      expect(taskCount).to.equal(0);

      const task1 = await toDoList.getTask(1);
      expect(task1.content).to.equal("");
      expect(task1.completed).to.equal(false);

      const task2 = await toDoList.getTask(2);
      expect(task2.content).to.equal("");
      expect(task2.completed).to.equal(false);
    });

    it("Should emit TaskCreated event when a task is created", async function () {
      const taskContent = "Task with event";
      await expect(toDoList.createTask(taskContent))
        .to.emit(toDoList, "TaskCreated")
        .withArgs(1, taskContent, false);
    });

    it("Should emit TaskCompleted event when a task is completed", async function () {
      await toDoList.createTask("Task to complete");
      await expect(toDoList.toggleCompleted(1))
        .to.emit(toDoList, "TaskCompleted")
        .withArgs(1, true);
    });

    it("Should emit AllTasksCleared event when all tasks are cleared", async function () {
      await toDoList.createTask("Task to be cleared");
      await expect(toDoList.clearTasks())
        .to.emit(toDoList, "AllTasksCleared");
    });
  });
});
