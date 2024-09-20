document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('boot-screen');
    const versaiaLogo = document.getElementById('versaia-logo');
    const nvidiaLogo = document.getElementById('nvidia-logo');
    const amdLogo = document.getElementById('amd-logo');
    const bootSequence = document.getElementById('boot-sequence');
    const loadingProgress = document.querySelector('.loading-progress');
    const bootMessage = document.getElementById('boot-message');
    const body = document.body;
    const biosSettings = document.getElementById('bios-settings');
    const loginScreen = document.getElementById('login-screen');
    const cpuClockValue = document.getElementById('cpu-clock-value');

    const versaiaSound = document.getElementById('versaia-sound');
    const nvidiaSound = document.getElementById('nvidia-sound');
    const amdSound = document.getElementById('amd-sound');
    const startupSound = document.getElementById('startup-sound');

    const messages = [
        "Initializing system...",
        "Loading core modules...",
        "Establishing network connections...",
        "Calibrating neural interface...",
        "Syncing with global databanks...",
        "Optimizing quantum algorithms...",
        "Activating AI assistants...",
        "Rendering user interface...",
        "Finalizing startup sequence..."
    ];

    let messageIndex = 0;
    let inBiosSettings = false;

    function showLogo(logoElement, soundElement, duration) {
        return new Promise((resolve) => {
            logoElement.style.display = 'block';
            soundElement.play().catch(e => console.error("Audio play failed:", e));
            setTimeout(() => {
                logoElement.style.display = 'none';
                resolve();
            }, duration);
        });
    }

    async function runBootSequence() {
        // Show Versaia logo
        await showLogo(versaiaLogo, versaiaSound, 5000);
        
        // Show NVIDIA logo
        await showLogo(nvidiaLogo, nvidiaSound, 3000);
        
        // Show AMD logo
        await showLogo(amdLogo, amdSound, 3000);
        
        // Start main boot sequence
        bootSequence.style.display = 'block';
        startupSound.play().catch(e => console.error("Startup sound play failed:", e));
        
        function displayNextMessage() {
            if (messageIndex < messages.length) {
                bootMessage.textContent = messages[messageIndex];
                messageIndex++;
                setTimeout(displayNextMessage, 3000);
            }
        }

        displayNextMessage();

        // Simulate loading progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 1;
            loadingProgress.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(progressInterval);
                setTimeout(showLoginScreen, 2000); // Wait for the last message to be displayed
            }
        }, 600); // 60 seconds total
    }

    // Listen for F2 key press
    document.addEventListener('keydown', (event) => {
        if (event.key === 'F2' && !inBiosSettings) {
            event.preventDefault();
            showBiosSettings();
        }
    });

    function showBiosSettings() {
        inBiosSettings = true;
        bootScreen.style.display = 'none';
        biosSettings.style.display = 'block';
    }

    // BIOS Settings
    const cpuClock = document.getElementById('cpu-clock');
    cpuClock.addEventListener('input', () => {
        cpuClockValue.textContent = `${cpuClock.value} GHz`;
    });

    const saveBios = document.getElementById('save-bios');
    saveBios.addEventListener('click', () => {
        biosSettings.style.display = 'none';
        bootScreen.style.display = 'flex';
        inBiosSettings = false;
        runBootSequence();
    });

    function showLoginScreen() {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
            bootScreen.style.display = 'none';
            loginScreen.style.display = 'block';
            body.classList.add('loaded');
        }, 1000);
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Here you would typically validate the login credentials
        // For this example, we'll just log the values and hide the login screen
        console.log(`Login attempt - Username: ${username}, Password: ${password}`);
        loginScreen.style.display = 'none';
    });

    // Start the boot sequence
    runBootSequence();
});
