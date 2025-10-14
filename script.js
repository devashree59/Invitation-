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
    
    // Initialize scroll indicators
    initScrollIndicators();
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
    if (index < 0 || index >= sections.length) return;
    
    sections[index].scrollIntoView({ 
        behavior: "smooth", 
        block: "nearest",
        inline: "start" 
    });
    
    // Update active dot
    updateActiveDot(index);
    
    setTimeout(() => (isScrolling = false), 600);
}

// Intersection Observer for scroll snap
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            currentIndex = [...sections].indexOf(entry.target);
            updateActiveDot(currentIndex);
        }
    });
}, { 
    threshold: [0.5],
    root: wrapper
});

sections.forEach(section => observer.observe(section));

// Desktop wheel
wrapper.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    isScrolling = true;

    if (e.deltaX > 0 && currentIndex < sections.length - 1) {
        currentIndex++;
    } else if (e.deltaX < 0 && currentIndex > 0) {
        currentIndex--;
    } else if (e.deltaY > 0 && currentIndex < sections.length - 1) {
        // Also allow vertical scrolling for devices without horizontal scroll
        currentIndex++;
    } else if (e.deltaY < 0 && currentIndex > 0) {
        currentIndex--;
    }
    scrollToSection(currentIndex);
});

// Mobile swipe
let startX = 0;
wrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

wrapper.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;
    if (endX < startX - 50 && currentIndex < sections.length - 1) {
        currentIndex++;
    } else if (endX > startX + 50 && currentIndex > 0) {
        currentIndex--;
    }
    scrollToSection(currentIndex);
});

// Scroll indicators functionality
function initScrollIndicators() {
    const dots = document.querySelectorAll('.scroll-dot');
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            currentIndex = index;
            scrollToSection(index);
        });
    });
}

function updateActiveDot(index) {
    const dots = document.querySelectorAll('.scroll-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (isScrolling) return;
    
    if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        currentIndex++;
        scrollToSection(currentIndex);
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        currentIndex--;
        scrollToSection(currentIndex);
    }
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
// Add this after the existing variables at the top
const arrowLeft = document.createElement('button');
const arrowRight = document.createElement('button');

// Add this function after the scrollToSection function
function createNavigationArrows() {
    // Left arrow
    arrowLeft.innerHTML = '‹';
    arrowLeft.className = 'nav-arrow arrow-left';
    arrowLeft.setAttribute('aria-label', 'Previous card');
    
    // Right arrow
    arrowRight.innerHTML = '›';
    arrowRight.className = 'nav-arrow arrow-right';
    arrowRight.setAttribute('aria-label', 'Next card');
    
    // Add to DOM
    document.body.appendChild(arrowLeft);
    document.body.appendChild(arrowRight);
    
    // Event listeners
    arrowLeft.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            scrollToSection(currentIndex);
        }
    });
    
    arrowRight.addEventListener('click', () => {
        if (currentIndex < sections.length - 1) {
            currentIndex++;
            scrollToSection(currentIndex);
        }
    });
    
    // Initial state
    updateArrowVisibility();
}

function updateArrowVisibility() {
    arrowLeft.classList.toggle('hidden', currentIndex === 0);
    arrowRight.classList.toggle('hidden', currentIndex === sections.length - 1);
}

// Update the scrollToSection function to include arrow visibility
function scrollToSection(index) {
    sections[index].scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
        isScrolling = false;
        updateArrowVisibility();
    }, 600);
}

// Call this function at the end of your script, before the countdown section
createNavigationArrows();