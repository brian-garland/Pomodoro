let timeLeft = 25 * 60; // 30 minutes in seconds
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const resetButton = document.getElementById('reset');
const modeText = document.getElementById('mode-text');
const toggleButton = document.getElementById('toggle-mode');

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
                timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
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
    timeLeft = 25 * 60;
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
    timeLeft = isWorkTime ? 25 * 60 : 5 * 60;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    toggleButton.textContent = isWorkTime ? 'Switch to Break' : 'Switch to Work';
    
    // Toggle the button classes
    if (isWorkTime) {
        toggleButton.classList.remove('break-mode');
        toggleButton.classList.add('work-mode');
    } else {
        toggleButton.classList.remove('work-mode');
        toggleButton.classList.add('break-mode');
    }
    
    updateDisplay();
}

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);
toggleButton.addEventListener('click', toggleMode);

// Initialize display
updateDisplay(); 

// Add this after your existing event listeners to set initial state
toggleButton.classList.add('work-mode'); // Set initial state to work mode 