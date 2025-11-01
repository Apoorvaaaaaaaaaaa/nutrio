document.getElementById('logout-link').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior

    // Remove login state from localStorage
    localStorage.removeItem('isLoggedIn');

    // Redirect to index.html
    window.location.href = 'index.html';
});




// Smooth Scrolling for Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetElement = document.querySelector(this.getAttribute('href'));
  
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update active state for the clicked link
            document.querySelectorAll('nav ul li a').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        } else {
            console.log(`Section "${this.getAttribute('href')}" does not exist.`);
        }
    });
  });
  
  
  // Detect Scroll and Show Contact Section When Scrolled Past Courses Section
  window.addEventListener('scroll', function () {
    const coursesSection = document.getElementById('courses-section');
    const contactSection = document.getElementById('contact');
  
    if (coursesSection) {
        const coursesSectionTop = coursesSection.getBoundingClientRect().top;
  
        if (coursesSectionTop < window.innerHeight) {
            contactSection.classList.add('visible');
        } else {
            contactSection.classList.remove('visible');
        }
  
        // Update active state for navigation links on scroll
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
  
            if (sectionTop >= 0 && sectionTop < window.innerHeight / 2) {
                const activeLink = document.querySelector(`nav a[href="#${section.id}"]`);
                if (activeLink) {
                    document.querySelectorAll('nav ul li a').forEach(nav => nav.classList.remove('active'));
                    activeLink.classList.add('active');
                }
            }
        });
    }
  });
  
  // Toggle the search bar expansion
  document.getElementById('search-icon').addEventListener('click', function () {
      const searchBar = document.querySelector('.search-bar');
      searchBar.classList.toggle('active');
    });
  
    let subMenu = document.getElementById("subMenu");
    let closeTimeout; // Variable to store the timeout
    
    function toggleSubMenu() {
        if (subMenu.classList.contains("open-menu")) {
            clearTimeout(closeTimeout); // Clear any existing timeout
            subMenu.classList.remove("open-menu");
        } else {
            subMenu.classList.add("open-menu");
    
            // Set a timeout to close the menu after 5 minutes
            closeTimeout = setTimeout(() => {
                subMenu.classList.remove("open-menu");
            }, 300000); // 5 minutes in milliseconds
        }
    }
    
    // Optional: Close the menu when clicking outside of it
    document.addEventListener("click", (event) => {
        if (!subMenu.contains(event.target) && !event.target.closest('.fa-user')) {
            subMenu.classList.remove("open-menu");
            clearTimeout(closeTimeout); // Clear the timeout when manually closing
        }
    });
    
    
  // Check login status and update navbar
  window.onload = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const authButtons = document.getElementById('auth-buttons');
    const profileIcon = document.getElementById('profile-icon');
  
    if (authButtons && profileIcon) {
        if (isLoggedIn) {
            authButtons.style.display = 'none'; // Hide Sign Up and Log In buttons
            profileIcon.style.display = 'block'; // Show Profile icon
        } else {
            authButtons.style.display = 'block'; // Show Sign Up and Log In buttons
            profileIcon.style.display = 'none'; // Hide Profile icon
        }
    }
  
    // Simulated login function for testing (you can replace this with actual logic)
    setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'true'); // Simulate successful login
        window.location.reload(); // Reload the page to update the navbar
    }, 2000); // Simulate login delay
  };
  
  
  