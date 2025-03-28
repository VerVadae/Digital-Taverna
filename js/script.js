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
   
    // Smooth page scrolling for quick links
    function smoothScrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
       
        if (!targetElement) {
            console.error(`Target element with ID ${targetId} not found`);
            return;
        }
        // Calculate absolute position of the target element
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = document.querySelector('header').offsetHeight;
       
        // Calculate final scroll position with explicit offset
        const offsetPosition = scrollTop + rect.top - headerHeight - 100;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }

    function handleNavigation(href) {
        // Extract the current page path (without query parameters)
        const currentPath = window.location.pathname;
       
        // Check if the link is to a different page
        if (href.includes('.html') && !href.startsWith(currentPath)) {
            // Cross-page navigation
            const [page, section] = href.split('#');
            sessionStorage.setItem('scrollToSection', section || '');
            window.location.href = href;
        } else {
            // Same-page or current page navigation
            // Remove .html# if present
            const cleanHref = href.replace('.html#', '#');
            smoothScrollToSection(cleanHref);
        }
    }

    // Handle both same-page and cross-page links
    document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute("href");
            handleNavigation(href);
        });
    });

    // Handle cross-page and same-page scrolling after page load
    const sectionToScroll = sessionStorage.getItem('scrollToSection');
    if (sectionToScroll) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
            smoothScrollToSection(`#${sectionToScroll}`);
            sessionStorage.removeItem('scrollToSection');
        }, 100);
    }
    
    // Form submission handling for spinning coins and form validation
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        const coinSvgs = [];
        
        inputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);

            // Create coin icon for validation
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

            // Validate form input
            input.addEventListener('input', function() {
                wrapper.classList.remove('input-valid', 'input-invalid');
                coinSvg.style.opacity = '0';

                if (input.validity.valid) {
                    wrapper.classList.add('input-valid');
                    coinSvg.style.opacity = '1';
                    
                    // Synchronize spin for all coins
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