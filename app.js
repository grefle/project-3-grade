class Task {
    constructor(title, description) {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.status = 'todo';
    }

    setStatus(status) {
        this.status = status;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(title, description) {
        const task = new Task(title, description);
        this.tasks.push(task);
        return task;
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.saveTasks();
    }

    updateTaskStatus(taskId, status) {
        const task = this.tasks.find((task) => task.id === taskId);
        if (task) {
            task.setStatus(status);
            this.updateTaskUI(task);
            this.saveTasks();
        }
    }

    updateTaskUI(task) {
        const taskElement = document.getElementById(task.id);
        if (taskElement) {
            taskElement.querySelector('.status').textContent = task.status;
            const taskList = document.getElementById(this.getTaskListIdByStatus(task.status));
            taskList.appendChild(taskElement);
        }
    }

    getTaskListIdByStatus(status) {
        switch (status) {
            case 'todo':
                return 'todoList';
            case 'inprogress':
                return 'inprogressList';
            case 'done':
                return 'doneList';
            case 'deleted':
                return 'deletedList';
            default:
                return 'todoList';
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            this.renderTasks();
        }
    }

    clearTasks() {
        this.tasks = [];
        this.saveTasks();
        this.clearTaskLists();
    }

    clearTaskLists() {
        const taskLists = document.getElementsByClassName('task-list');
        Array.from(taskLists).forEach((taskList) => {
            taskList.innerHTML = '';
        });
    }

    renderTasks() {
        this.tasks.forEach((task) => {
            this.renderTask(task);
        });
    }

    renderTask(task) {
        const taskList = document.getElementById(this.getTaskListIdByStatus(task.status));
        const li = document.createElement('li');
        li.id = task.id;
        li.innerHTML = `
      <span>${task.title}</span>
      <span>${task.description}</span>
      <span class="status">${task.status}</span>
      <button onclick="updateTaskStatus('${task.id}', 'done')">Done</button>
      <button onclick="updateTaskStatus('${task.id}', 'inprogress')">In Progress</button>
      <button onclick="updateTaskStatus('${task.id}', 'todo')">To Do</button>
      <button onclick="deleteTask('${task.id}')">Delete</button>
    `;
        taskList.appendChild(li);
    }
}

const taskManager = new TaskManager();

function addTask(event) {
    event.preventDefault();
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (title !== '' && description !== '') {
        const task = taskManager.addTask(title, description);
        taskManager.renderTask(task);
        titleInput.value = '';
        descriptionInput.value = '';
    }
}

function updateTaskStatus(taskId, status) {
    taskManager.updateTaskStatus(taskId, status);
}

function deleteTask(taskId) {
    taskManager.deleteTask(taskId);
    const taskElement = document.getElementById(taskId);
    if (taskElement) {
        taskElement.remove();
    }
}

function clearAllTasks() {
    taskManager.clearTasks();
}

document.getElementById('taskForm').addEventListener('submit', addTask);

taskManager.loadTasks();
