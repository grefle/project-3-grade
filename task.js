// Оголошення класу Task
// ...

class Task {
    constructor(title, description, status) {
        this.id = generateUniqueId(); // Генерація унікального ідентифікатора
        this.title = title;
        this.description = description;
        this.status = status;
    }

    setStatus(status) {
        this.status = status;
    }

    // Додаткові методи для роботи з властивостями та статусом завдання
}

// ...

