const tasks = [
  {
    id: "1138465078061",
    completed: false,
    text: "Посмотреть новый урок по JavaScript",
  },
  {
    id: "1138465078062",
    completed: false,
    text: "Выполнить тест после урока",
  },
  {
    id: "1138465078063",
    completed: false,
    text: "Выполнить ДЗ после урока",
  },
];

function createTaskItem(taskId, taskText) {
  const taskItem = document.createElement("div");
  taskItem.className = "task-item";
  taskItem.dataset.taskId = taskId;

  const taskItemMainContainer = document.createElement("div");
  taskItemMainContainer.className = "task-item__main-container";

  const taskItemMainContent = document.createElement("div");
  taskItemMainContent.className = "task-item__main-content";

  taskItemMainContainer.append(taskItemMainContent);
  taskItem.append(taskItemMainContainer);

  const checkboxForm = document.createElement("form");
  checkboxForm.className = "checkbox-form";

  const inputCheckbox = document.createElement("input");
  inputCheckbox.className = "checkbox-form__checkbox";
  inputCheckbox.type = "checkbox";
  inputCheckbox.id = `task-${taskId}`;

  const labelCheckbox = document.createElement("label");
  labelCheckbox.htmlFor = `task-${taskId}`;

  checkboxForm.append(inputCheckbox, labelCheckbox);

  const taskItemText = document.createElement("span");
  taskItemText.className = "task-item__text";
  taskItemText.textContent = taskText;

  const deleteTaskButton = document.createElement("button");
  deleteTaskButton.className =
    "task-item__delete-button default-button delete-button";
  deleteTaskButton.type = "submit";
  deleteTaskButton.textContent = "Удалить";

  taskItemMainContent.append(checkboxForm, taskItemText);
  checkboxForm.append(inputCheckbox, labelCheckbox);
  taskItemMainContainer.append(deleteTaskButton);

  return taskItem;
}

// Error message (validation)

const createTaskForm = document.querySelector(".create-task-block");

function createErrorMessageBlock(text) {
  const errorBlock = document.createElement("span");
  errorBlock.className = "error-message-block";
  errorBlock.textContent = text;

  return errorBlock;
}

createTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const { target } = event;

  const newTaskText = (target.taskName.value || "").trim();
  const isExistTaskText = tasks.some((task) => task.text === newTaskText);
  const errorMessageBlockFromDOM = document.querySelector(
    ".error-message-block"
  );

  if (!newTaskText) {
    const errorBlock = createErrorMessageBlock(
      "Название задачи не должно быть пустым."
    );
    createTaskForm.append(errorBlock);
  } else if (isExistTaskText) {
    const errorBlock = createErrorMessageBlock(
      "Задача с таким названием уже существует."
    );
    createTaskForm.append(errorBlock);
  } else if (newTaskText && !isExistTaskText) {
    if (errorMessageBlockFromDOM) {
      errorMessageBlockFromDOM.remove();
    }

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText,
    };

    tasks.push(newTask);
    const taskItem = createTaskItem(newTask.id, newTask.text);
    tasksListContainer.append(taskItem);

    target.taskName.value = "";
  }
});

const tasksListContainer = document.querySelector(".tasks-list");
tasks.forEach((task) => {
  const { id, text } = task;

  const taskItem = createTaskItem(id, text);
  tasksListContainer.append(taskItem);
});

// Modal

function createModalBlock(text) {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay modal-overlay_hidden";

  const deleteModal = document.createElement("div");
  deleteModal.className = "delete-modal";

  modalOverlay.append(deleteModal);

  const modalTitle = document.createElement("h3");
  modalTitle.className = "delete-modal__question";
  modalTitle.innerText = text;

  const modalButtons = document.createElement("div");
  modalButtons.className = "delete-modal__buttons";

  deleteModal.append(modalTitle, modalButtons);

  const confirmButton = document.createElement("button");
  confirmButton.className = "delete-modal-button";
  confirmButton.innerText = "Удалить";

  const cencelButton = document.createElement("button");
  cencelButton.className = "delete-modal-button";
  cencelButton.innerText = "Отмена";

  modalButtons.append(confirmButton, cencelButton);

  return {
    deleteModal,
    cencelButton,
    confirmButton,
    modalOverlay,
  };
}

let targetTaskIdToDelete = null;
const { deleteModal, cencelButton, confirmButton, modalOverlay } =
  createModalBlock("Вы действительно хотите удалить эту задачу?");
document.body.prepend(modalOverlay);

cencelButton.addEventListener("click", () => {
  modalOverlay.classList.add("modal-overlay_hidden");
});
confirmButton.addEventListener("click", () => {
  const deleteIndex = tasks.findIndex(
    (task) => task.id === targetTaskIdToDelete
  );

  if (deleteIndex >= 0) {
    tasks.splice(deleteIndex, 1);
    const taskItemHTML = document.querySelector(
      `[data-task-id="${targetTaskIdToDelete}"]`
    );
    taskItemHTML.remove();
    modalOverlay.classList.add("modal-overlay_hidden");
  }
});

const tasksList = document.querySelector(".tasks-list");
tasksList.addEventListener("click", (event) => {
  const { target } = event;
  const closestTarget = target.closest(".task-item__delete-button");
  if (closestTarget) {
    const closestTask = closestTarget.closest(".task-item");
    if (closestTask) {
      const taskId = closestTask.dataset.taskId;
      targetTaskIdToDelete = taskId;
      modalOverlay.classList.remove("modal-overlay_hidden");
    }
  }
});

// Change theme by click on Tab

let isDark = false;

function changeTheme({ bodyBackground, taskItemTextColor, buttonBorder }) {
  document.body.style.background = bodyBackground;
  document.querySelectorAll(".task-item").forEach((taskItem) => {
    taskItem.style.color = taskItemTextColor;
  });
  document.querySelectorAll("button").forEach((button) => {
    button.style.border = buttonBorder;
  });
}

window.addEventListener("keydown", (event) => {
  const { code } = event;
  if (code === "Tab") {
    isDark = !isDark;
    if (isDark) {
      changeTheme({
        bodyBackground: "#24292E",
        taskItemTextColor: "#fff",
        buttonBorder: "1px solid #fff",
      });
    } else {
      changeTheme({
        bodyBackground: "initial",
        taskItemTextColor: "initial",
        buttonBorder: "none",
      });
    }
  }
});


