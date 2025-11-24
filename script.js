// DOM Elements
const taskModal = document.getElementById('taskModal');
const addTaskBtn = document.getElementById('addTaskBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const closeModalBtn = document.querySelector('.close');
const taskInput = document.getElementById('taskInput');
const todoList = document.getElementById('todo-list');
const themeSelect = document.getElementById('themeSelect');
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

// Tab Elements
const tabTodo = document.getElementById('tab-todo');
const tabPomodoro = document.getElementById('tab-pomodoro');
const tabSettings = document.getElementById('tab-settings');
const todoApp = document.getElementById('todo-app');
const pomodoroApp = document.getElementById('pomodoro-app');
const settingsApp = document.getElementById('settings-app');

// Intro Elements
const introPage = document.getElementById('intro-page');
const appContainer = document.querySelector('.app-container');
const introBtns = document.querySelectorAll('.intro-btn');

// Pomodoro Elements
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const musicToggleBtn = document.getElementById('musicToggle');
const customTimerBtn = document.getElementById('customTimerBtn');
const alarmSound = document.getElementById('alarmSound');
const bgm = document.getElementById('bgm');

// Custom Timer Modal Elements
const customTimerModal = document.getElementById('customTimerModal');
const modalHr = document.getElementById('modalHr');
const modalMin = document.getElementById('modalMin');
const modalSec = document.getElementById('modalSec');
const unitBtns = document.querySelectorAll('.unit-btn');
const numBtns = document.querySelectorAll('.num-btn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalSetBtn = document.getElementById('modalSetBtn');
const timeUpModal = document.getElementById('timeUpModal');
const timeUpOkBtn = document.getElementById('timeUpOkBtn');

// State
let draggedItem = null;
let currentTheme = 'snow';
let particles = [];

// Pomodoro State
const TIMER_DEFAULT = 25 * 60;
let timeLeft = TIMER_DEFAULT;
let timerInterval = null;
let isRunning = false;
let isMusicOn = true;

// --- Tab Switching ---
function switchTab(tabId) {
    // Reset all tabs
    [tabTodo, tabPomodoro, tabSettings].forEach(tab => tab.classList.remove('active'));
    [todoApp, pomodoroApp, settingsApp].forEach(app => app.classList.add('hidden'));

    // Activate selected
    if (tabId === 'todo') {
        tabTodo.classList.add('active');
        todoApp.classList.remove('hidden');
    } else if (tabId === 'pomodoro') {
        tabPomodoro.classList.add('active');
        pomodoroApp.classList.remove('hidden');
    } else if (tabId === 'settings') {
        tabSettings.classList.add('active');
        settingsApp.classList.remove('hidden');
    }
}

tabTodo.addEventListener('click', () => switchTab('todo'));
tabPomodoro.addEventListener('click', () => switchTab('pomodoro'));
tabSettings.addEventListener('click', () => switchTab('settings'));

// --- Intro Page Logic ---
introBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        introPage.classList.add('hidden');
        appContainer.classList.remove('hidden');
        switchTab(target);
    });
});

// --- Task Management ---

// Open Modal
addTaskBtn.addEventListener('click', () => {
    taskModal.classList.remove('hidden');
    taskInput.focus();
});

// Close Modal
closeModalBtn.addEventListener('click', () => {
    taskModal.classList.add('hidden');
    taskInput.value = '';
});

// Save Task
saveTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        createTaskElement(text, todoList);
        taskModal.classList.add('hidden');
        taskInput.value = '';
    }
});

// Create Task Element
function createTaskElement(text, parent) {
    const div = document.createElement('div');
    div.classList.add('task-card');
    div.draggable = true;
    div.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = (e) => {
        e.stopPropagation(); // Prevent drag start
        div.remove();
    };

    div.appendChild(deleteBtn);

    // Drag Events
    div.addEventListener('dragstart', (e) => {
        draggedItem = div;
        setTimeout(() => div.style.display = 'none', 0);
    });

    div.addEventListener('dragend', (e) => {
        setTimeout(() => {
            draggedItem = null;
            div.style.display = 'block';
        }, 0);
    });

    parent.appendChild(div);
}

// Drag & Drop Logic
function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    // Find the closest task-list
    const targetList = ev.target.closest('.column').querySelector('.task-list');
    if (targetList && draggedItem) {
        targetList.appendChild(draggedItem);
    }
}

// --- Pomodoro Logic ---

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
        h: h > 0 ? h.toString().padStart(2, '0') : null,
        m: m.toString().padStart(2, '0'),
        s: s.toString().padStart(2, '0')
    };
}

function updateDisplay() {
    const time = formatTime(timeLeft);
    if (time.h) {
        minutesEl.textContent = `${time.h}:${time.m}`;
        secondsEl.textContent = time.s;
    } else {
        minutesEl.textContent = time.m;
        secondsEl.textContent = time.s;
    }
}

function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startPauseBtn.textContent = 'Pause';

    if (isMusicOn) {
        bgm.loop = true;
        bgm.play().catch(e => console.log("BGM play failed", e));
    }

    const endTime = Date.now() + timeLeft * 1000;

    timerInterval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((endTime - now) / 1000);

        if (remaining >= 0) {
            timeLeft = remaining;
            updateDisplay();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            timeLeft = 0;
            updateDisplay();
            startPauseBtn.textContent = 'Start';

            bgm.pause();
            bgm.currentTime = 0;

            alarmSound.currentTime = 0;
            alarmSound.play().catch(e => console.log("Alarm play failed", e));
            timeUpModal.classList.remove('hidden');
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    startPauseBtn.textContent = 'Start';
    bgm.pause();
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

function resetTimer() {
    pauseTimer();
    timeLeft = TIMER_DEFAULT;
    updateDisplay();
}

startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

musicToggleBtn.addEventListener('click', () => {
    isMusicOn = !isMusicOn;
    musicToggleBtn.textContent = isMusicOn ? '[MUSIC: ON]' : '[MUSIC: OFF]';
    if (isRunning) {
        if (isMusicOn) bgm.play().catch(e => { });
        else bgm.pause();
    }
});

document.querySelectorAll('.preset-btn').forEach(btn => {
    if (btn.id === 'customTimerBtn') return;
    btn.addEventListener('click', (e) => {
        const minutes = parseInt(e.target.dataset.time);
        pauseTimer();
        timeLeft = minutes * 60;
        updateDisplay();
    });
});

timeUpOkBtn.addEventListener('click', () => {
    timeUpModal.classList.add('hidden');
    alarmSound.pause();
    alarmSound.currentTime = 0;
});

// Custom Timer Modal Logic
let customTime = { hr: "00", min: "00", sec: "00" };
let currentUnit = 'min';

customTimerBtn.addEventListener('click', () => {
    customTime = { hr: "00", min: "00", sec: "00" };
    currentUnit = 'min';
    updateModalDisplay();
    updateUnitButtons();
    customTimerModal.classList.remove('hidden');
});

modalCancelBtn.addEventListener('click', () => {
    customTimerModal.classList.add('hidden');
});

function updateModalDisplay() {
    modalHr.textContent = customTime.hr;
    modalMin.textContent = customTime.min;
    modalSec.textContent = customTime.sec;
}

function updateUnitButtons() {
    unitBtns.forEach(btn => {
        if (btn.dataset.unit === currentUnit) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

unitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        currentUnit = btn.dataset.unit;
        updateUnitButtons();
    });
});

numBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const num = btn.dataset.num;
        let currentVal = customTime[currentUnit];
        if (currentVal === "00") currentVal = "0" + num;
        else currentVal += num;
        currentVal = currentVal.slice(-2);
        customTime[currentUnit] = currentVal;
        updateModalDisplay();
    });
});

modalSetBtn.addEventListener('click', () => {
    const hours = parseInt(customTime.hr);
    const minutes = parseInt(customTime.min);
    const seconds = parseInt(customTime.sec);
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    if (totalSeconds > 0) {
        pauseTimer();
        timeLeft = totalSeconds;
        updateDisplay();
        customTimerModal.classList.add('hidden');
    } else {
        alert("Please set a time greater than 0.");
    }
});

// --- Background Animation ---

// Resize Canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Particle Class
class Particle {
    constructor(theme) {
        this.reset(theme);
    }

    reset(theme) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height; // Start above
        this.theme = theme;

        if (theme === 'snow') {
            this.size = Math.random() * 3 + 2; // 2-5px squares
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.color = '#ffffff';
        } else if (theme === 'leaves') {
            this.size = Math.random() * 6 + 4; // 4-10px
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 2 - 1; // More sway
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            // Autumn colors
            const colors = ['#d35400', '#e67e22', '#f1c40f', '#c0392b'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        } else if (theme === 'rain') {
            this.size = Math.random() * 2 + 1; // Width
            this.length = Math.random() * 10 + 5; // Height
            this.speedY = Math.random() * 10 + 10; // Fast
            this.speedX = 0;
            this.color = '#4a90e2';
        } else if (theme === 'fireflies') {
            this.size = Math.random() * 3 + 2;
            this.speedY = Math.random() * 0.5 - 0.25; // Float up/down
            this.speedX = Math.random() * 0.5 - 0.25; // Float left/right
            this.color = '#f1c40f';
            this.alpha = Math.random();
            this.alphaSpeed = 0.02;
        }
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;

        if (this.theme === 'leaves') {
            this.rotation += this.rotationSpeed;
        } else if (this.theme === 'fireflies') {
            this.alpha += this.alphaSpeed;
            if (this.alpha > 1 || this.alpha < 0) {
                this.alphaSpeed *= -1;
            }
        }

        // Reset if out of bounds
        if (this.y > canvas.height) {
            this.reset(this.theme);
            this.y = -10; // Reset to top
        }
        if (this.x > canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        if (this.theme === 'snow') {
            ctx.fillRect(this.x, this.y, this.size, this.size); // Pixel snow
        } else if (this.theme === 'leaves') {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size); // Pixel leaf
            ctx.restore();
        } else if (this.theme === 'rain') {
            ctx.fillRect(this.x, this.y, this.size, this.length);
        } else if (this.theme === 'fireflies') {
            ctx.globalAlpha = Math.abs(this.alpha);
            ctx.fillRect(this.x, this.y, this.size, this.size);
            ctx.globalAlpha = 1.0;
        }
    }
}

// Init Particles
function initParticles() {
    particles = [];
    let count = 100;
    if (currentTheme === 'rain') count = 300;
    if (currentTheme === 'fireflies') count = 50;

    for (let i = 0; i < count; i++) {
        const p = new Particle(currentTheme);
        // Randomize initial Y to fill screen
        p.y = Math.random() * canvas.height;
        particles.push(p);
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

// Theme Switching
document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Set theme
        currentTheme = card.dataset.theme;
        initParticles();
    });
});

// Start
initParticles();
animate();
updateDisplay();
