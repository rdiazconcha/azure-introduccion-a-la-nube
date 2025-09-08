// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const header = document.querySelector('.header');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Hamburger animation
hamburger.addEventListener('click', () => {
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = header.offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.module-card, .feature-card, .stat');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(el);
    });
});

// Form handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (!name || !email || !message) {
            showNotification('Por favor, completa todos los campos.', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
        contactForm.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Module card hover effects
document.addEventListener('DOMContentLoaded', () => {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const azureIcon = document.querySelector('.azure-icon');
    
    if (hero && azureIcon) {
        const rate = scrolled * -0.5;
        azureIcon.style.transform = `translateY(${rate}px)`;
    }
});

// Dynamic greeting based on time
document.addEventListener('DOMContentLoaded', () => {
    const hour = new Date().getHours();
    let greeting = 'Bienvenido';
    
    if (hour < 12) {
        greeting = 'Buenos días';
    } else if (hour < 18) {
        greeting = 'Buenas tardes';
    } else {
        greeting = 'Buenas noches';
    }
    
    // You could add this to a greeting element if you have one
    console.log(`${greeting}! Bienvenido al curso de Azure.`);
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Print page functionality
function printPage() {
    window.print();
}

// Share functionality (if Web Share API is supported)
async function shareContent() {
    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Azure: Introducción a la nube de Microsoft',
                text: 'Descubre el poder de la computación en la nube con Microsoft Azure',
                url: window.location.href
            });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    } else {
        // Fallback to clipboard
        try {
            await navigator.clipboard.writeText(window.location.href);
            showNotification('¡Enlace copiado al portapapeles!', 'success');
        } catch (error) {
            showNotification('No se pudo copiar el enlace', 'error');
        }
    }
}

// Loading screen (optional)
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 300);
    }
});

// Console welcome message
console.log(`
🚀 Azure Course Website
========================
Desarrollado para el aprendizaje de Microsoft Azure
Versión: 1.0.0
¡Gracias por visitar nuestro curso!
`);

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Página cargada en ${Math.round(loadTime)}ms`);
});
