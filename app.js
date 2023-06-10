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

  setTitle(title) {
    this.title = title;
  }

  setDescription(description) {
    this.description = description;
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

  updateTask(taskId, title, description) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (task) {
      task.setTitle(title);
      task.setDescription(description);
      this.updateTaskUI(task);
      this.saveTasks();
    }
  }

  updateTaskUI(task) {
    const taskElement = document.getElementById(task.id);
    if (taskElement) {
      taskElement.querySelector('.status').textContent = task.status;
      const taskList = document.getElementById(
        this.getTaskListIdByStatus(task.status),
      );
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
      const tasksData = JSON.parse(savedTasks);
      this.tasks = tasksData.map((taskData) => {
        const task = new Task(taskData.title, taskData.description);
        task.id = taskData.id;
        task.status = taskData.status;
        return task;
      });
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
    this.clearTaskLists(); // Очищення списків завдань перед додаванням нових завдань
    this.tasks.forEach((task) => {
      this.renderTask(task);
    });
  }

  renderTask(task) {
    const taskList = document.getElementById(
      this.getTaskListIdByStatus(task.status),
    );
    const li = document.createElement('li');
    li.id = task.id;
    li.innerHTML = `
      <span>${task.title}</span>
      <span>Опис: ${task.description}</span>
      <span class="status">${task.status}</span>
      <button onclick="editTask('${task.id}')">Edit</button> <!-- Додано кнопку Edit -->
      <button onclick="updateTaskStatus('${task.id}', 'todo')">To Do</button>
      <button onclick="updateTaskStatus('${task.id}', 'inprogress')">In Progress</button>
      <button onclick="updateTaskStatus('${task.id}', 'done')">Done</button>
      <button onclick="deleteTask('${task.id}')">Delete</button>
    `;
    taskList.appendChild(li);
    this.saveTasks();
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

function editTask(taskId) {
  const task = taskManager.tasks.find((task) => task.id === taskId);
  if (task) {
    document.getElementById('editTitle').value = task.title;
    document.getElementById('editDescription').value = task.description;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modal').dataset.taskId = taskId;
  }
}

function saveChanges() {
  const taskId = document.getElementById('modal').dataset.taskId;
  const title = document.getElementById('editTitle').value.trim();
  const description = document.getElementById('editDescription').value.trim();
  if (taskId && title !== '' && description !== '') {
    taskManager.updateTask(taskId, title, description);
    closeModal();
    taskManager.renderTasks(); // Оновлення відображення завдань
  }
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal').dataset.taskId = '';
  document.getElementById('editTitle').value = '';
  document.getElementById('editDescription').value = '';
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

// Оголошення функції пошуку завдань за ключовими словами
function searchTasks() {
  const searchInput = document.getElementById('searchInput');
  const keyword = searchInput.value.trim().toLowerCase();

  const filteredTasks = taskManager.tasks.filter((task) => {
    const title = task.title.toLowerCase();
    const description = task.description.toLowerCase();
    return title.includes(keyword) || description.includes(keyword);
  });

  taskManager.clearTaskLists();
  filteredTasks.forEach((task) => {
    taskManager.renderTask(task);
  });

  searchInput.value = '';
}

// Оголошення функції очищення результатів пошуку
function clearSearchResults() {
  taskManager.clearTaskLists();
  taskManager.renderTasks();
}

// Додавання події для пошуку завдань при натисканні кнопки "Search"
document
  .getElementById('searchForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    searchTasks();
  });

// Додавання події для очищення результатів пошуку при натисканні кнопки "Clear Search"
document
  .getElementById('clearSearchButton')
  .addEventListener('click', clearSearchResults);

document.getElementById('taskForm').addEventListener('submit', addTask);

taskManager.loadTasks();
