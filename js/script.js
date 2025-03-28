/**
 * Digital Taverna - Main JavaScript File
 * Handles mobile menu toggling and other interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate the hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }
    
    // Add scroll event for header styling
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only process if the href is not just "#"
            if (targetId !== '#') {
                e.preventDefault();
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Calculate header height for offset
                    const headerHeight = header ? header.offsetHeight : 0;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        
                        // Reset hamburger icon
                        const spans = menuToggle.querySelectorAll('span');
                        spans.forEach(span => span.classList.remove('active'));
                    }
                }
            }
        });
    });
    
    // Form submission handling for spinning coins for valid, and invalid danger shake animations.
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        const coinSvgs = [];
        
        inputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            // This is where we create the coin icon for validation. Top section is the position, while the second half is the actual grapic and colour design.
            const coinElement = document.createElement('div');
            coinElement.innerHTML = `
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style="
                    position: absolute;
                    right: calc(-1.5rem);
                    top: 1.2rem;
                    transform: translateY(-50%);
                    width: 1.5rem;
                    height: 1.5rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                ">
                    <circle cx="16" cy="16" r="14" fill="#FFD700"/>
                    <path d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z"
                          fill="#FFA500"/>
                </svg>
            `;
            wrapper.appendChild(coinElement);
            const coinSvg = coinElement.querySelector('svg');
            coinSvgs.push(coinSvg);

            // Validates the form information and asjust error handling or optimistic rendering CSS classes.
            input.addEventListener('input', function() {
                wrapper.classList.remove('input-valid', 'input-invalid');
                coinSvg.style.opacity = '0';


                if (input.validity.valid) {
                    wrapper.classList.add('input-valid');
                    coinSvg.style.opacity = '1';
                    
                    // Synchronize spin for all the coins. Do not change for ADHD reasons.
                    coinSvgs.forEach((svg, index) => {
                        svg.style.animation = 'none';
                        void svg.offsetWidth;
                        svg.style.animation = `coin-pop 0.5s ease-out, coin-spin 1s linear infinite`;
                    });
                } else {
                    wrapper.classList.add('input-invalid');
                }
            });
        });

        // Form submission handler
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check form validity
            if (contactForm.checkValidity()) {
                // Form is valid - proceed with submission
                const submitButton = contactForm.querySelector('button[type="submit"]');
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                setTimeout(function() {
                    const successMessage = document.createElement('div');
                    successMessage.className = 'form-success';
                    successMessage.innerHTML = '<p>Message sent successfully! We\'ll get back to you soon.</p>';
                    
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successMessage);
                }, 1500);
            } else {
                // Trigger validation display
                contactForm.reportValidity();
            }
        });
    }
});
