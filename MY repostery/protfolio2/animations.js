/**
 * Advanced Animations Controller
 * Enhanced with image parallax and scroll effects
 */

class AdvancedAnimations {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.scrollY = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.heroImage = document.querySelector('.hero-image');
        this.init();
    }

    init() {
        if (this.isReducedMotion) return;
        
        this.setupScrollListener();
        this.setupParallaxEffects();
        this.setupMicroInteractions();
        this.setupStaggerAnimations();
        this.setupLoadingAnimations();
        this.setupImageParallax();
    }

    setupScrollListener() {
        let ticking = false;
        
        const updateOnScroll = () => {
            this.scrollY = window.scrollY;
            this.updateScrollEffects();
            this.updateImageParallax();
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
            
            this.handleScrollDirection();
        }, { passive: true });
    }

    setupImageParallax() {
        if (!this.heroImage || this.isReducedMotion) return;
        
        // Listen for animation changes
        document.addEventListener('animationchange', (e) => {
            const { animation } = e.detail;
            if (animation === 'none') {
                this.heroImage.style.transform = '';
            }
        });
    }

    updateImageParallax() {
        if (!this.heroImage || this.isReducedMotion) return;
        
        const animationType = this.heroImage.getAttribute('data-animation');
        if (animationType === 'none') return;
        
        // Add subtle parallax effect based on scroll
        const parallaxY = this.scrollY * 0.05;
        const rotateX = Math.sin(this.scrollY * 0.01) * 2;
        const rotateY = Math.cos(this.scrollY * 0.005) * 2;
        
        // Only apply parallax if there's already an animation
        const currentTransform = this.heroImage.style.transform || '';
        const baseTransform = currentTransform.includes('matrix') ? '' : currentTransform;
        
        this.heroImage.style.transform = `
            ${baseTransform}
            translateY(${parallaxY}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
    }

    handleScrollDirection() {
        clearTimeout(this.scrollTimeout);
        
        if (!this.isScrolling) {
            document.body.classList.add('is-scrolling');
            this.isScrolling = true;
        }
        
        this.scrollTimeout = setTimeout(() => {
            document.body.classList.remove('is-scrolling');
            this.isScrolling = false;
        }, 100);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            
            const updateParallax = () => {
                const yPos = -(this.scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            };
            
            window.addEventListener('scroll', updateParallax, { passive: true });
        });
    }

    setupMicroInteractions() {
        // Button ripple effect
        const buttons = document.querySelectorAll('.btn:not(.no-ripple)');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const x = e.clientX - e.target.getBoundingClientRect().left;
                const y = e.clientY - e.target.getBoundingClientRect().top;
                
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple styles
        const rippleStyles = document.createElement('style');
        rippleStyles.textContent = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.7);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Image hover enhancement */
            .hero-image {
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                          box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .hero-image:hover {
                transform: scale(1.02) translateY(-5px);
                box-shadow: 
                    var(--shadow-lg),
                    0 20px 40px rgba(var(--primary-color-rgb), 0.3),
                    0 0 60px rgba(var(--primary-color-rgb), 0.1);
            }
        `;
        document.head.appendChild(rippleStyles);
    }

    setupStaggerAnimations() {
        const staggerContainers = document.querySelectorAll('.stagger-container');
        
        staggerContainers.forEach(container => {
            const items = container.children;
            
            Array.from(items).forEach((item, index) => {
                item.style.setProperty('--stagger-index', index);
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }

    setupLoadingAnimations() {
        const images = document.querySelectorAll('img[data-src]');
        
        images.forEach(img => {
            img.classList.add('skeleton');
            
            img.addEventListener('load', () => {
                img.classList.remove('skeleton');
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', () => {
                img.classList.remove('skeleton');
            });
        });
    }

    updateScrollEffects() {
        const scrollProgress = (this.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
        
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (this.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        const shapes = document.querySelectorAll('.floating-shapes .shape');
        shapes.forEach((shape, index) => {
            const speed = 0.2 + (index * 0.1);
            const yPos = -(this.scrollY * speed);
            const rotate = this.scrollY * 0.05;
            shape.style.transform = `translateY(${yPos}px) rotate(${rotate}deg)`;
        });
    }

    static easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    static easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    static animate(element, properties, duration = 300, easing = 'ease') {
        return new Promise((resolve) => {
            const computedStyle = window.getComputedStyle(element);
            const transitions = [];
            
            Object.keys(properties).forEach(property => {
                const startValue = computedStyle[property];
                transitions.push(`${property} ${duration}ms ${easing}`);
            });
            
            element.style.transition = transitions.join(', ');
            
            setTimeout(() => {
                Object.assign(element.style, properties);
            }, 10);
            
            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration + 10);
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAnimations();
    
    const handleScroll = () => {
        if (window.scrollY > 100) {
            document.body.classList.add('has-scrolled');
        } else {
            document.body.classList.remove('has-scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
});

// Add scroll-based styles
const scrollStyles = document.createElement('style');
scrollStyles.textContent = `
    .navbar.scrolled {
        background-color: rgba(var(--bg-primary-rgb), 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    .has-scrolled .scroll-indicator {
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }
    
    .is-scrolling {
        cursor: grabbing;
    }
    
    .skeleton {
        background: linear-gradient(90deg, 
            rgba(var(--text-light-rgb), 0.1) 25%, 
            rgba(var(--text-light-rgb), 0.2) 50%, 
            rgba(var(--text-light-rgb), 0.1) 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    .stagger-container > * {
        opacity: 0;
        transform: translateY(20px);
        animation: staggerFadeIn 0.6s ease forwards;
        animation-delay: calc(var(--stagger-index, 0) * 0.1s);
    }
    
    @keyframes staggerFadeIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Image scroll effects */
    @media (prefers-reduced-motion: no-preference) {
        .hero-image {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .floating-element {
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
    }
`;
document.head.appendChild(scrollStyles);