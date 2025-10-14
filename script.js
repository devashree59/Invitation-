const wrapper = document.querySelector('.invitation-wrapper');
const sections = document.querySelectorAll('.invitation-container');
let currentIndex = 0;
let isScrolling = false;

// ===================== Navigation Arrows =====================
const arrowLeft = document.createElement('button');
const arrowRight = document.createElement('button');

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
        if (!isScrolling && currentIndex > 0) {
            isScrolling = true;
            currentIndex--;
            scrollToSection(currentIndex);
        }
    });
    
    arrowRight.addEventListener('click', () => {
        if (!isScrolling && currentIndex < sections.length - 1) {
            isScrolling = true;
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

function scrollToSection(index) {
    sections[index].scrollIntoView({ 
        behavior: "smooth",
        block: "nearest",
        inline: "center"
    });
    setTimeout(() => {
        isScrolling = false;
        updateArrowVisibility();
    }, 600);
}

// Initialize arrows when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createNavigationArrows();
    updateArrowVisibility();
});

// Intersection Observer for horizontal scroll snap
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            currentIndex = [...sections].indexOf(entry.target);
            updateArrowVisibility();
        }
    });
}, { 
    threshold: [0.7],
    rootMargin: '0px'
});

sections.forEach(section => observer.observe(section));

// Desktop wheel for horizontal scrolling
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

// Mobile swipe for horizontal scrolling
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

// ===================== Countdown =====================
function updateCountdown() {
    const countdownElement = document.querySelector('.countdown-number');
    const weddingDate = new Date('2025-11-19');
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
setInterval(updateCountdown, 1000 * 60 * 60);