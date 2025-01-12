let timeLeft;
let workDuration = 25;
let breakDuration = 5;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleButton = document.getElementById('toggle-mode');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');

// Todo list functionality
const todoInputs = [
    document.getElementById('todo1'),
    document.getElementById('todo2'),
    document.getElementById('todo3')
];

// Save todos to localStorage
function saveTodos() {
    const todos = todoInputs.map(input => input.value);
    localStorage.setItem('pomodoro-todos', JSON.stringify(todos));
}

// Load todos from localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('pomodoro-todos');
    if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        todos.forEach((todo, index) => {
            if (todoInputs[index]) {
                todoInputs[index].value = todo;
            }
        });
    }
}

// Add event listeners to todo inputs
todoInputs.forEach(input => {
    input.addEventListener('input', saveTodos);
});

// Load todos when the page loads
loadTodos();

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    
    // Update the display elements
    minutesDisplay.textContent = minutesStr;
    secondsDisplay.textContent = secondsStr;
    
    // Update the browser tab title
    const mode = isWorkTime ? 'Work' : 'Break';
    document.title = timeLeft > 0 ? 
        `(${minutesStr}:${secondsStr}) ${mode} - Pomodoro Timer` : 
        'Pomodoro Timer';
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? workDuration * 60 : breakDuration * 60;
                modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
                updateDisplay();
                alert(isWorkTime ? 'Break is over! Time to work!' : 'Work period is over! Take a break!');
                startButton.textContent = 'Start';
            }
        }, 1000);
        startButton.textContent = 'Pause';
    } else {
        clearInterval(timerId);
        timerId = null;
        startButton.textContent = 'Start';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = workDuration * 60;
    modeText.textContent = 'Work Time';
    toggleButton.textContent = 'Switch to Break';
    updateDisplay();
    startButton.classList.remove('paused');
    document.title = 'Pomodoro Timer';
}

function toggleMode() {
    if (timerId !== null) {
        return; // Don't allow mode switching while timer is running
    }
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? workDuration * 60 : breakDuration * 60;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleButton.textContent = isWorkTime ? 'Switch to Break' : 'Switch to Work';
    
    if (isWorkTime) {
        toggleButton.classList.remove('break-mode');
        toggleButton.classList.add('work-mode');
    } else {
        toggleButton.classList.remove('work-mode');
        toggleButton.classList.add('break-mode');
    }
    
    updateDisplay();
}

workTimeInput.addEventListener('input', function() {
    const value = parseInt(this.value) || 0;
    workDuration = Math.max(0, value);
    if (isWorkTime && timerId === null) {
        timeLeft = workDuration * 60;
        updateDisplay();
    }
});

breakTimeInput.addEventListener('input', function() {
    const value = parseInt(this.value) || 0;
    breakDuration = Math.max(0, value);
    if (!isWorkTime && timerId === null) {
        timeLeft = breakDuration * 60;
        updateDisplay();
    }
});

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', toggleMode);

// Initialize display
updateDisplay(); 

// Add this after your existing event listeners to set initial state
toggleButton.classList.add('work-mode'); // Set initial state to work mode 

// Add this at the end of your file to initialize timeLeft
timeLeft = workDuration * 60; 

// At the bottom of the file, update initialization
workTimeInput.value = workDuration;  // Set initial input field values
breakTimeInput.value = breakDuration;
timeLeft = workDuration * 60;  // Set initial timer value
updateDisplay();  // Update the display
toggleButton.classList.add('work-mode');  // Set initial state to work mode 