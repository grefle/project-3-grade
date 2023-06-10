class Modal {
  constructor() {
    this.modalElement = document.getElementById('modal');
    this.titleInput = document.getElementById('modalTitle');
    this.descriptionInput = document.getElementById('modalDescription');
    this.saveButton = document.getElementById('modalSaveButton');
    this.currentTaskId = null;
    this.saveButton.addEventListener('click', this.saveChanges.bind(this));
  }

  open(taskId, title, description) {
    this.currentTaskId = taskId;
    this.titleInput.value = title;
    this.descriptionInput.value = description;
    this.modalElement.style.display = 'block';
  }

  close() {
    this.currentTaskId = null;
    this.titleInput.value = '';
    this.descriptionInput.value = '';
    this.modalElement.style.display = 'none';
  }

  saveChanges() {
    const title = this.titleInput.value.trim();
    const description = this.descriptionInput.value.trim();
    if (title !== '' && description !== '') {
      taskManager.updateTask(this.currentTaskId, title, description);
      this.close();
    }
  }
}

const modal = new Modal();
