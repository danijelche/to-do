document.addEventListener('DOMContentLoaded', () => {
    const inputTask = document.getElementById('input-task');
    const addTask = document.getElementById('add-task');
    const tasksList = document.getElementById('tasks-list');
    const showAlert = document.querySelector('.alert');
    const clearAll = document.querySelector('.clear-all');

    let editMode = false;
    let taskToEdit = null;
    let tasks = [];

    // Add item function
    function addItem(e) {
        e.preventDefault();
        const inputText = inputTask.value.trim();
        if (inputText === '') {
            displayAlert('Enter a task', 'danger');
        } else if (editMode && taskToEdit) {
            // Update the task text
            taskToEdit.text = inputText;

            // Reset edit mode
            editMode = false;
            taskToEdit = null;
            addTask.innerHTML = '<i class="fa-solid fa-plus"></i>';

            // Display success alert
            displayAlert('Task updated', 'success');
        } else {
            const newTask = { text: inputText, completed: false };
            tasks.push(newTask);
            displayAlert('Item added to list', 'success');
        }

        
        renderTasksList();
        // Save tasks
        saveTasks();
        inputTask.value = '';
    }

    // Clear all tasks
    function clearTasks(){
        tasks = [];
       tasksList.innerHTML = '';
       localStorage.removeItem('tasks');
       displayAlert('All tasks cleared', 'success')
    }

    // Display alert function
    function displayAlert(text, action) {
        showAlert.textContent = text;
        showAlert.classList.add(`alert-${action}`);
        showAlert.style.opacity = '1';

        setTimeout(() => {
            showAlert.textContent = '';
            showAlert.classList.remove(`alert-${action}`);
            showAlert.style.opacity = '0';
        }, 3000);
    }

    // Render tasks list function
    const renderTasksList = () => {
        tasksList.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('task');
            listItem.innerHTML = `
                <p style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.text}</p>
                <div class="task-buttons">
                    <button class="check-btn"><i class="fa-solid fa-check"></i></button>
                    <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                    <button class="delete-btn"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            `;

            // Check button event listener
            listItem.querySelector('.check-btn').addEventListener('click', () => {
                const p = listItem.querySelector('p');
                task.completed = !task.completed;
                p.style.textDecoration = task.completed ? 'line-through' : 'none';
                displayAlert(task.completed ? 'Task completed' : 'Task marked as incomplete', 'success');
                saveTasks();
            });

            // Edit button event listener
            listItem.querySelector('.edit-btn').addEventListener('click', () => {
                editMode = true; 
                taskToEdit = task; 
                inputTask.value = task.text;
                addTask.textContent = 'Save';
            });

            // Delete button event listener
            listItem.querySelector('.delete-btn').addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                renderTasksList();
                displayAlert('Task deleted', 'danger');
                saveTasks();
            });

            tasksList.appendChild(listItem);
        });
    };

    // Save tasks to local storage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Load tasks from local storage
    const loadTasks = () => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasksList();
        }
    };

    // Load tasks initially
    loadTasks();

    // Add event listener to the form
    addTask.addEventListener('click', addItem);
    clearAll.addEventListener('click', clearTasks)
});
