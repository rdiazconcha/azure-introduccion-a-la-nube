// Module-specific JavaScript

// Progress tracking
let currentProgress = 0;
const totalLessons = 4;

// Update progress function
function updateProgress(lessonNumber) {
    currentProgress = lessonNumber;
    const progressPercentage = (currentProgress / totalLessons) * 100;
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = `${progressPercentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${currentProgress} de ${totalLessons} lecciones completadas`;
    }
    
    // Update TOC
    updateTOC(lessonNumber);
    
    // Save progress to localStorage
    saveProgress();
}

// Update table of contents
function updateTOC(lessonNumber) {
    const tocItems = document.querySelectorAll('.toc-list li');
    tocItems.forEach((item, index) => {
        if (index < lessonNumber) {
            item.classList.add('completed');
        } else {
            item.classList.remove('completed');
        }
    });
}

// Save progress to localStorage
function saveProgress() {
    const moduleData = {
        moduleNumber: 1,
        progress: currentProgress,
        totalLessons: totalLessons,
        lastAccessed: new Date().toISOString()
    };
    
    localStorage.setItem('azureCourse_module1', JSON.stringify(moduleData));
    
    // Update overall course progress
    updateCourseProgress();
}

// Load progress from localStorage
function loadProgress() {
    const savedData = localStorage.getItem('azureCourse_module1');
    if (savedData) {
        const moduleData = JSON.parse(savedData);
        updateProgress(moduleData.progress);
    }
}

// Update overall course progress
function updateCourseProgress() {
    const totalModules = 5;
    let completedModules = 0;
    
    for (let i = 1; i <= totalModules; i++) {
        const moduleData = localStorage.getItem(`azureCourse_module${i}`);
        if (moduleData) {
            const data = JSON.parse(moduleData);
            if (data.progress === data.totalLessons) {
                completedModules++;
            }
        }
    }
    
    const courseProgress = {
        completedModules: completedModules,
        totalModules: totalModules,
        lastAccessed: new Date().toISOString()
    };
    
    localStorage.setItem('azureCourse_overall', JSON.stringify(courseProgress));
}

// Lesson completion tracking
function markLessonAsCompleted(lessonIndex) {
    if (lessonIndex > currentProgress) {
        updateProgress(lessonIndex);
        showNotification('¡Lección completada!', 'success');
        
        // Check if module is completed
        if (currentProgress === totalLessons) {
            setTimeout(() => {
                showModuleCompletionModal();
            }, 1000);
        }
    }
}

// Show module completion modal
function showModuleCompletionModal() {
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-trophy"></i>
                <h2>¡Módulo Completado!</h2>
            </div>
            <div class="modal-body">
                <p>¡Felicitaciones! Has completado exitosamente el Módulo 1: Introducción a la nube.</p>
                <p>Ahora estás listo para continuar con el siguiente módulo.</p>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="closeModal()">Continuar estudiando</button>
                <a href="module2.html" class="btn btn-primary">Ir al siguiente módulo</a>
            </div>
        </div>
        <div class="modal-overlay" onclick="closeModal()"></div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modal.querySelector('.modal-content').style.transform = 'scale(1)';
        modal.querySelector('.modal-overlay').style.opacity = '1';
    }, 100);
}

// Close modal function
function closeModal() {
    const modal = document.querySelector('.completion-modal');
    if (modal) {
        modal.querySelector('.modal-content').style.transform = 'scale(0.8)';
        modal.querySelector('.modal-overlay').style.opacity = '0';
        
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Reading time calculator
function calculateReadingTime() {
    const content = document.querySelector('.main-content');
    if (content) {
        const text = content.textContent || content.innerText;
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);
        
        // Update reading time in meta
        const metaSection = document.querySelector('.module-meta');
        if (metaSection) {
            const timeSpan = metaSection.querySelector('.reading-time');
            if (timeSpan) {
                timeSpan.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min de lectura`;
            }
        }
    }
}

// Scroll spy for TOC
function initScrollSpy() {
    const sections = document.querySelectorAll('.lesson-section');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    function updateActiveSection() {
        let currentSection = '';
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.id || section.querySelector('h2').textContent.toLowerCase().replace(/\s+/g, '-');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection(); // Initial call
}

// Copy code to clipboard
function initCodeCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.title = 'Copiar código';
        
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.color = '#4CAF50';
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                    button.style.color = '';
                }, 2000);
                
                showNotification('Código copiado al portapapeles', 'success');
            });
        });
        
        const pre = block.parentNode;
        pre.style.position = 'relative';
        pre.appendChild(button);
    });
}

// Interactive elements
function initInteractiveElements() {
    // Collapsible sections
    const collapsibleHeaders = document.querySelectorAll('[data-collapsible]');
    
    collapsibleHeaders.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = content.style.display !== 'none';
            
            content.style.display = isExpanded ? 'none' : 'block';
            
            const icon = header.querySelector('i');
            if (icon) {
                icon.className = isExpanded ? 'fas fa-chevron-right' : 'fas fa-chevron-down';
            }
        });
    });
    
    // Tooltips for technical terms
    const techTerms = document.querySelectorAll('[data-tooltip]');
    
    techTerms.forEach(term => {
        term.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.9rem;
                z-index: 1000;
                max-width: 300px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.bottom + 10) + 'px';
        });
        
        term.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                document.body.removeChild(tooltip);
            }
        });
    });
}

// Quiz functionality (placeholder for future implementation)
function initQuizzes() {
    const quizContainers = document.querySelectorAll('.quiz-container');
    
    quizContainers.forEach(container => {
        const questions = container.querySelectorAll('.quiz-question');
        const submitBtn = container.querySelector('.quiz-submit');
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                let correctAnswers = 0;
                let totalQuestions = questions.length;
                
                questions.forEach(question => {
                    const selectedAnswer = question.querySelector('input[type="radio"]:checked');
                    const correctAnswer = question.querySelector('[data-correct="true"]');
                    
                    if (selectedAnswer && selectedAnswer === correctAnswer) {
                        correctAnswers++;
                        question.classList.add('correct');
                    } else {
                        question.classList.add('incorrect');
                    }
                });
                
                const score = (correctAnswers / totalQuestions) * 100;
                showNotification(`Puntuación: ${score}% (${correctAnswers}/${totalQuestions})`, 
                    score >= 70 ? 'success' : 'warning');
                
                if (score >= 70) {
                    markLessonAsCompleted(currentProgress + 1);
                }
            });
        }
    });
}

// Print module content
function printModule() {
    window.print();
}

// Share module
async function shareModule() {
    const moduleTitle = document.querySelector('.module-title-section h1').textContent;
    const shareData = {
        title: `Azure Course - ${moduleTitle}`,
        text: 'Aprende sobre computación en la nube con este excelente curso',
        url: window.location.href
    };
    
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            console.log('Error sharing:', error);
        }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            showNotification('¡Enlace copiado al portapapeles!', 'success');
        } catch (error) {
            showNotification('No se pudo copiar el enlace', 'error');
        }
    }
}

// Add completion checkmarks to content sections
function addCompletionCheckmarks() {
    const sections = document.querySelectorAll('.lesson-section');
    
    sections.forEach((section, index) => {
        const header = section.querySelector('h2');
        if (header) {
            const checkmark = document.createElement('span');
            checkmark.className = 'completion-checkmark';
            checkmark.innerHTML = '<i class="fas fa-check-circle"></i>';
            checkmark.style.cssText = `
                color: #4CAF50;
                margin-left: 1rem;
                opacity: 0.3;
                cursor: pointer;
                transition: opacity 0.3s ease;
            `;
            
            checkmark.addEventListener('click', () => {
                checkmark.style.opacity = '1';
                markLessonAsCompleted(index + 1);
            });
            
            header.appendChild(checkmark);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    calculateReadingTime();
    initScrollSpy();
    initCodeCopyButtons();
    initInteractiveElements();
    initQuizzes();
    addCompletionCheckmarks();
    
    // Add modal styles to head
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .completion-modal .modal-content {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            transform: scale(0.8);
            transition: transform 0.3s ease;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        
        .completion-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .modal-header i {
            font-size: 4rem;
            color: #FFD700;
            margin-bottom: 1rem;
        }
        
        .modal-header h2 {
            color: #333;
            font-size: 2rem;
            margin: 0;
        }
        
        .modal-body p {
            text-align: center;
            color: #666;
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
        }
        
        .copy-code-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            border: none;
            padding: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        pre:hover .copy-code-btn {
            opacity: 1;
        }
        
        .toc-list a.active {
            color: #0078d4;
            font-weight: 600;
            background: #f0f8ff;
            padding-left: 2rem;
        }
    `;
    
    document.head.appendChild(modalStyles);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printModule();
    }
    
    // Ctrl/Cmd + Shift + S for share
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        shareModule();
    }
});

// Export functions for global access
window.moduleUtils = {
    markLessonAsCompleted,
    updateProgress,
    printModule,
    shareModule,
    closeModal
};
