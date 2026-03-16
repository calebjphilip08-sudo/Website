// Sidebar toggle functionality and Mobile Menu Handler
(function() {
    // Check for saved preference
    const sidebarMode = localStorage.getItem('sidebarMode') === 'true';
    
    // Apply saved preference on page load
    if (sidebarMode) {
        document.body.classList.add('sidebar-mode');
    }
    
    // Toggle layout function (matches button onclick)
    window.toggleLayout = function() {
        document.body.classList.toggle('sidebar-mode');
        const isActive = document.body.classList.contains('sidebar-mode');
        localStorage.setItem('sidebarMode', isActive);
    };
    
    // Keep old name for backwards compatibility
    window.toggleSidebar = window.toggleLayout;
    
    // Mobile menu toggle
    window.toggleMobileMenu = function() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        }
    };
    
    // Close menu when clicking on a link
    function closeMenu() {
        const hamburger = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const header = document.querySelector('header');
        if (header && !header.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Handle dropdown clicks in sidebar mode and mobile
    document.addEventListener('DOMContentLoaded', function() {
        const dropdowns = document.querySelectorAll('.dropdown');
        const navLinks = document.querySelectorAll('.nav-links a, .nav-links li > a');
        
        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Only close if not a dropdown toggle
                if (!this.classList.contains('dropdown-toggle')) {
                    closeMenu();
                }
            });
        });
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            
            toggle.addEventListener('click', function(e) {
                // Check if on mobile/tablet (menu is visible)
                const isMobileView = window.innerWidth <= 768;
                
                if (isMobileView || document.body.classList.contains('sidebar-mode')) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                    
                    // Close other dropdowns
                    dropdowns.forEach(other => {
                        if (other !== dropdown) {
                            other.classList.remove('active');
                        }
                    });
                }
            });
        });
    });
    
    // Close menu on window resize (when switching from mobile to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
            
            // Close any open dropdowns in desktop view
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
})();
