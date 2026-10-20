const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyMessage = document.getElementById("empty-message");

const STORAGE_KEY = "my-todo-tasks";

function loadTasks() {
try {
const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (!savedTasks) {
        return [];
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
        return [];
    }

    return parsedTasks.filter(task =>
        task &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean"
    );
} catch (error) {
    console.error("Could not load tasks:", error);
    return [];
}

}

let tasks = loadTasks();

function saveTasks() {
try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
} catch (error) {
console.error("Could not save tasks:", error);
alert("Tasks could not be saved in this browser.");
}
}

function renderTasks() {
taskList.replaceChildren();

tasks.forEach(task => {
    const listItem = document.createElement("li");
    listItem.className = "task-item";

    if (task.completed) {
        listItem.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    checkbox.addEventListener("change", () => {
        toggleTask(task.id);
    });

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    deleteButton.addEventListener("click", () => {
        deleteTask(task.id);
    });

    listItem.append(checkbox, taskText, deleteButton);
    taskList.appendChild(listItem);
});

const remainingTasks = tasks.filter(task => !task.completed).length;

taskCount.textContent =
    `${remainingTasks} task${remainingTasks !== 1 ? "s" : ""} left`;

emptyMessage.classList.toggle("hidden", tasks.length > 0);

}

function addTask(text) {
const newTask = {
id: crypto.randomUUID(),
text: text,
completed: false
};

tasks.push(newTask);
saveTasks();
renderTasks();

}

function toggleTask(taskId) {
tasks = tasks.map(task => {
if (task.id === taskId) {
return {
...task,
completed: !task.completed
};
}

    return task;
});

saveTasks();
renderTasks();

}

function deleteTask(taskId) {
tasks = tasks.filter(task => task.id !== taskId);

saveTasks();
renderTasks();

}

taskForm.addEventListener("submit", event => {
event.preventDefault();

const text = taskInput.value.trim();

if (text === "") {
    return;
}

addTask(text);
taskInput.value = "";
taskInput.focus();

});

renderTasks();
