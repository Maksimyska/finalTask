// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract ToDoList {
    // Структура задачи
    struct Task {
        uint id;
        string content;
        bool completed;
    }

    // Маппинг для хранения задач по id
    mapping(uint => Task) private tasks;
    uint private taskCount;

    // События
    event TaskCreated(uint indexed id, string content, bool completed);
    event TaskCompleted(uint indexed id, bool completed);
    event AllTasksCleared();

    // Функция создания задачи
    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    // Функция получения задачи
    function getTask(uint _id) public view returns (Task memory) {
        return tasks[_id];
    }

    // Функция переключения состояния задачи (выполнена/не выполнена)
    function toggleCompleted(uint _id) public {
        Task storage task = tasks[_id];
        task.completed = !task.completed;
        emit TaskCompleted(_id, task.completed);
    }

    // Функция удаления всех задач
    function clearTasks() public {
        for (uint i = 1; i <= taskCount; i++) {
            delete tasks[i];
        }
        taskCount = 0;
        emit AllTasksCleared();
    }

    // Функция для получения общего количества задач
    function getTaskCount() public view returns (uint) {
        return taskCount;
    }

    // Функция для получения задачи по индексу
    function getTasks(uint start, uint end) public view returns (Task[] memory) {
        require(start <= end && end <= taskCount, "Invalid range");

        uint size = end - start + 1;
        Task[] memory taskList = new Task[](size);
        for (uint i = 0; i < size; i++) {
            taskList[i] = tasks[start + i];
        }

        return taskList;
    }
}
