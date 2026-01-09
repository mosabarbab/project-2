/**
 * Portfolio Website - Main JavaScript
 * Fixed and simplified version
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Initialize Components =====
    initNavigation();
    initThemeToggle();
    initTypewriter();
    initImageAnimations();
    initAnimations();
    initContactForm();
    updateCurrentYear();
    
    // ===== Navigation =====
    function initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', function() {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.classList.toggle('active');
                navLinks.classList.toggle('active');
                this.setAttribute('aria-expanded', !isExpanded);
            });
            
            // Close menu when clicking on a link
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInsideNav = navLinks.contains(event.target) || menuToggle.contains(event.target);
                if (!isClickInsideNav && navLinks.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    // ===== Theme Toggle =====
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (themeToggle) {
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            } else if (savedTheme === 'light') {
                document.body.classList.remove('dark-mode');
                themeToggle.setAttribute('aria-label', 'Switch to dark mode');
            } else if (prefersDark.matches) {
                // Use system preference if no saved preference
                document.body.classList.add('dark-mode');
                themeToggle.setAttribute('aria-label', 'Switch to light mode');
            }
            
            // Toggle theme on button click
            themeToggle.addEventListener('click', function() {
                const isDark = document.body.classList.toggle('dark-mode');
                this.setAttribute('aria-label', 
                    isDark ? 'Switch to light mode' : 'Switch to dark mode'
                );
                
                // Save preference
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
            });
            
            // Listen for system theme changes
            prefersDark.addEventListener('change', function(e) {
                const hasSavedTheme = localStorage.getItem('theme') !== null;
                
                if (!hasSavedTheme) {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                        themeToggle.setAttribute('aria-label', 'Switch to light mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
                    }
                }
            });
        }
    }
    
    // ===== Typewriter Effect =====
    function initTypewriter() {
        const typewriter = document.getElementById('typewriter');
        
        if (!typewriter) return;
        
        const words = ['Web Developer', 'UI/UX Designer', 'Problem Solver', 'Creative Thinker'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isWaiting = false;
        
        function type() {
            if (isWaiting) return;
            
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typewriter.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriter.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isWaiting = true;
                setTimeout(() => {
                    isWaiting = false;
                    isDeleting = true;
                }, 1500);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            
            const typingSpeed = isDeleting ? 50 : 100;
            setTimeout(type, typingSpeed);
        }
        
        // Start after a short delay
        setTimeout(() => {
            typewriter.style.width = '100%';
            type();
        }, 1000);
    }
    
    // ===== Image Animations =====
    function initImageAnimations() {
        const heroImage = document.getElementById('heroImage');
        const animationButtons = document.querySelectorAll('.animation-btn');
        
        if (!heroImage || !animationButtons.length) return;
        
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            heroImage.classList.add('none');
            return;
        }
        
        // Set default animation
        heroImage.classList.add('float');
        
        // Handle animation button clicks
        animationButtons.forEach(button => {
            button.addEventListener('click', function() {
                const animationType = this.dataset.animation;
                
                // Remove all animation classes
                heroImage.classList.remove('float', 'pulse', 'rotate', 'none');
                
                // Add selected animation class
                if (animationType !== 'none') {
                    heroImage.classList.add(animationType);
                }
                
                // Update active button
                animationButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // ===== Scroll Animations =====
    function initAnimations() {
        // Animate counters
        const counters = document.querySelectorAll('.stat-number');
        const skillBars = document.querySelectorAll('.skill-fill');
        
        // Create Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Fade in animation
                    if (entry.target.classList.contains('fade-in')) {
                        entry.target.classList.add('visible');
                    }
                    
                    // Animate counters
                    if (entry.target.classList.contains('stat')) {
                        const counter = entry.target.querySelector('.stat-number');
                        if (counter) animateCounter(counter);
                    }
                    
                    // Animate skill bars
                    if (entry.target.classList.contains('skill-bar')) {
                        const skillBar = entry.target.querySelector('.skill-fill');
                        if (skillBar) animateSkillBar(skillBar);
                    }
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe all fade-in elements, stats, and skill bars
        document.querySelectorAll('.fade-in, .stat, .skill-bar').forEach(el => {
            observer.observe(el);
        });
        
        // Initialize elements that are already in view
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    el.classList.add('visible');
                    observer.unobserve(el);
                }
            });
        }, 100);
        
        // Counter animation function
        function animateCounter(element) {
            const target = parseInt(element.dataset.count) || 0;
            const duration = 2000;
            const startTime = Date.now();
            const startValue = parseInt(element.textContent) || 0;
            
            function updateCounter() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
                element.textContent = currentValue;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            }
            
            requestAnimationFrame(updateCounter);
        }
        
        // Skill bar animation function
        function animateSkillBar(element) {
            const width = element.dataset.width || 100;
            element.style.width = '0%';
            
            setTimeout(() => {
                element.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.width = `${width}%`;
            }, 300);
        }
        
        // Create scroll progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        // Update progress bar on scroll
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }
    
    // ===== Contact Form =====
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                alert('Thank you! Your message has been sent successfully.');
                
                // Reset form
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
        
        // Email validation function
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    }
    
    // ===== Update Current Year =====
    function updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== Add scroll progress bar styles =====
    const progressBarStyles = document.createElement('style');
    progressBarStyles.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(to right, var(--primary-color), var(--primary-light));
            z-index: 10000;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(progressBarStyles);
    
});