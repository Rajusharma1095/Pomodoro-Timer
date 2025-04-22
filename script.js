document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timeDisplay = document.querySelector('.time');
    const modeDisplay = document.querySelector('.mode');
    const focusTimeInput = document.getElementById('focus-time');
    const breakTimeInput = document.getElementById('break-time');
    const progressRing = document.querySelector('.progress-ring__circle');
    
    // Constants
    const CIRCLE_CIRCUMFERENCE = 816.8; // 2 * PI * 130 (circle radius)
    
    // Timer state
    let timerInterval;
    let isRunning = false;
    let isPaused = false;
    let isFocusMode = true;
    let totalSeconds = parseInt(focusTimeInput.value) * 60;
    let currentSeconds = totalSeconds;
    
    // Update progress ring
    function updateProgressRing() {
        const progress = currentSeconds / totalSeconds;
        const offset = CIRCLE_CIRCUMFERENCE - (progress * CIRCLE_CIRCUMFERENCE);
        progressRing.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
        progressRing.style.strokeDashoffset = offset;
    }
    
    // Format time for display (MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Update display
    function updateDisplay() {
        timeDisplay.textContent = formatTime(currentSeconds);
        modeDisplay.textContent = isFocusMode ? 'Focus Time' : 'Break Time';
        updateProgressRing();
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(timerInterval);
        isFocusMode = true;
        totalSeconds = parseInt(focusTimeInput.value) * 60;
        currentSeconds = totalSeconds;
        isRunning = false;
        isPaused = false;
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        focusTimeInput.disabled = false;
        breakTimeInput.disabled = false;
        
        progressRing.style.stroke = '#ff6347'; // Red for focus
        updateDisplay();
    }
    
    // Start timer
    function startTimer() {
        isRunning = true;
        isPaused = false;
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        focusTimeInput.disabled = true;
        breakTimeInput.disabled = true;
        
        timerInterval = setInterval(() => {
            if (currentSeconds > 0) {
                currentSeconds--;
                updateDisplay();
            } else {
                // Switch modes when timer completes
                playNotificationSound();
                clearInterval(timerInterval);
                isFocusMode = !isFocusMode;
                
                // Set new time based on current mode
                if (isFocusMode) {
                    totalSeconds = parseInt(focusTimeInput.value) * 60;
                    progressRing.style.stroke = '#ff6347'; // Red for focus
                } else {
                    totalSeconds = parseInt(breakTimeInput.value) * 60;
                    progressRing.style.stroke = '#4caf50'; // Green for break
                }
                
                currentSeconds = totalSeconds;
                updateDisplay();
                startTimer(); // Auto start next phase
            }
        }, 1000);
    }
    
    // Pause timer
    function pauseTimer() {
        clearInterval(timerInterval);
        isPaused = true;
        isRunning = false;
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // Play notification sound
    function playNotificationSound() {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLHPM7tZyKgктлиsrvvvnfeeegfgdeeffefefekjenfnn'); // Simple beep sound
        audio.play().catch(err => console.log('Audio playback failed:', err));
    }
    
    // Initialize display
    updateDisplay();
    
    // Event listeners
    startBtn.addEventListener('click', () => {
        if (!isRunning) {
            if (isPaused) {
                // Resume
                startTimer();
            } else {
                // New start
                startTimer();
            }
        }
    });
    
    pauseBtn.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        }
    });
    
    resetBtn.addEventListener('click', () => {
        resetTimer();
    });
    
    focusTimeInput.addEventListener('change', () => {
        if (!isRunning) {
            resetTimer();
        }
    });
    
    breakTimeInput.addEventListener('change', () => {
        if (!isRunning) {
            resetTimer();
        }
    });
});
