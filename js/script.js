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
    
    // This sets the animation style of the auto scrolling. Do not change as it looks fairly smooth as is.
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Calculates the relative positiion of the headings we want for quick naving against the Viewport. So it should make it works across devices.
    function scrollToElementWithOffset(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const headerHeight = document.querySelector('header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 100;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Checks for on and off page quick link presses.
    function handleNavigation(href) {
        if (href.includes('.html')) {
            const [page, section] = href.split('#');
            if (section) {
                sessionStorage.setItem('scrollToSection', section);
            }
            window.location.href = href;
        } else if (href.startsWith('#')) {
            const targetId = href.substring(1);
            scrollToElementWithOffset(targetId);
        }
    }
    
    document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            handleNavigation(href);
        });
    });
    
    // Sets a timer to ensure slower internet speeds can load the service html file properly. 
    const sectionToScroll = sessionStorage.getItem('scrollToSection');
    if (sectionToScroll) {
        setTimeout(() => {
            scrollToElementWithOffset(sectionToScroll);
            sessionStorage.removeItem('scrollToSection');
        }, 100);
    }
    
    // Form submission handling for spinning coins and form validation - This no longer works since using this email method. Maybe try again later.
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

    }
});

// Form submission handler - Doesnt work now that the FormSender is enacted.
// contactForm.addEventListener('submit', function(e) {
//     e.preventDefault();
    
//     // Check form validity
//     if (contactForm.checkValidity()) {
//         // Form is valid - proceed with submission
//         const submitButton = contactForm.querySelector('button[type="submit"]');
//         submitButton.textContent = 'Sending...';
//         submitButton.disabled = true;
        
//         setTimeout(function() {
//             const successMessage = document.createElement('div');
//             successMessage.className = 'form-success';
//             successMessage.innerHTML = '<p>Message sent successfully! We\'ll get back to you soon.</p>';
            
//             contactForm.innerHTML = '';
//             contactForm.appendChild(successMessage);
//         }, 1500);
//     } else {
//         // Trigger validation display
//         contactForm.reportValidity();
//     }
// });



function showCurrentPageButtons(){
        let currentURL = location.href
        // console.log(currentURL, "URL HERE")
        const hashtagRegex = /#/

        // Another if statement to check for quick link to headings. Presumes that quick links only work for services, which is so far true.
        if (currentURL.match(hashtagRegex)){
            //console.log("Are we here?")
            const getAllHeaderLinks = document.querySelectorAll('.nav-links li a');
            getAllHeaderLinks.forEach((link) => {
                //console.log(link)
                if (link.outerText === "Services"){
                    link.parentElement.className = "header-nav-link-active"
                    //console.log("Found matching CSS element:", link.outerText, "vs", "services check")
            }
        })
        }

        // Checks for all the other main pages to check for the heading.
        else {
        const regex = /\/([^\/]+)\.html$/;
        const regexMatch = currentURL.match(regex)
        //console.log(regexMatch, "Regex checked")
        let newURL = ""
        if (regexMatch === null){
            newURL = "index"      
        } else {
        newURL = regexMatch[1]
        }
        // console.log(newURL, " <--- Successfully acquired the new URL for checking")
        let cssCheck = ""
        switch (newURL) {
            case "home":
                cssCheck = "Home"
                break;
            case "services":
                cssCheck = "Services"
                break;
            case "about":
                cssCheck = "About Us"
                break;
            case "brands":
                cssCheck = "Brand Portfolio"
                break;
            case "contact":
                cssCheck = "Contact"
                break;
            case "index":
                cssCheck = "Home"
                break;
        }

        // console.log(cssCheck,  "<------ After Switch case is complete.")
        const getAllHeaderLinks = document.querySelectorAll('.nav-links li a');
        getAllHeaderLinks.forEach((link) => {
            if (link.outerText === cssCheck){
                link.parentElement.className = "header-nav-link-active"
                // console.log("Found matching CSS element:", link.outerText, "vs", cssCheck)
            }
        })
    }
}