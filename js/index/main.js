// JAVASCRIPT: Mobile Menu + Smooth Scroll + Counters

// MOBILE MENU TOGGLE
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

// SMOOTH SCROLLING for anchor links (e.g., #six-month, #six-week)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === "#") return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            
            // Close mobile menu after clicking (if open)
            if (navLinks.classList.contains('show')) {
                navLinks.classList.remove('show');
            }
        }
    });
});

// ANIMATED COUNTERS (triggered when stats section comes into view)
const counters = document.querySelectorAll('.counter');
let counted = false;

const startCounting = () => {
    if (counted) return;
    counted = true;
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            const current = parseInt(counter.innerText);
            const increment = Math.ceil(target / 25);
            
            if (current < target) {
                counter.innerText = current + increment;
                setTimeout(updateCount, 35);
            } else {
                // Add percentage sign only for the employment rate stat
                counter.innerText = target + (target === 85 ? '%' : '');
            }
        };
        updateCount();
    });
};

// Intersection Observer to detect when stats section is visible
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounting();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

if (statsSection) observer.observe(statsSection);
