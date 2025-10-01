// Full-screen functionality
function requestFullScreen() {
    const element = document.documentElement;
    
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// Try to enter full-screen mode on page load
document.addEventListener('DOMContentLoaded', function() {
    // Request full-screen mode
    requestFullScreen();
    
    // Hide browser UI on mobile devices
    if ('standalone' in window.navigator && !window.navigator.standalone) {
        // For iOS Safari
        document.body.style.height = '100vh';
        document.body.style.overflow = 'hidden';
    }
});

// Handle resize events to maintain full-screen appearance
window.addEventListener('resize', function() {
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
});

// Scroll functionality
const wrapper = document.querySelector('.invitation-wrapper');
const sections = document.querySelectorAll('.invitation-container');
let currentIndex = 0;
let isScrolling = false;

function scrollToSection(index) {
    sections[index].scrollIntoView({ behavior: "smooth" });
    setTimeout(() => (isScrolling = false), 600);
}

// Intersection Observer for scroll snap
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            currentIndex = [...sections].indexOf(entry.target);
        }
    });
}, { threshold: [0.5] });

sections.forEach(section => observer.observe(section));

// Desktop wheel
wrapper.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    isScrolling = true;

    if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        currentIndex++;
    } else if (e.deltaY < 0 && currentIndex > 0) {
        currentIndex--;
    }
    scrollToSection(currentIndex);
});

// Mobile swipe
let startY = 0;
wrapper.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
});
wrapper.addEventListener('touchend', (e) => {
    let endY = e.changedTouches[0].clientY;
    if (endY < startY - 50 && currentIndex < sections.length - 1) {
        currentIndex++;
    } else if (endY > startY + 50 && currentIndex > 0) {
        currentIndex--;
    }
    scrollToSection(currentIndex);
});

// ===================== Countdown =====================
function updateCountdown() {
    const countdownElement = document.querySelector('.countdown-number');
    const weddingDate = new Date('2025-11-19'); // Wedding date
    const today = new Date();

    const diffTime = weddingDate - today;
    if (diffTime > 0) {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        countdownElement.innerHTML = `${diffDays} DAYS <span class="to-go-text">TO GO</span>`;
    } else {
        countdownElement.innerHTML = `HAPPY WEDDING DAY!`;
    }
}

updateCountdown();
setInterval(updateCountdown, 1000 * 60 * 60); // update every hour