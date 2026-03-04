// Sidebar toggle functionality - Optimized for Performance
(function() {
    'use strict';
    
    // Check for saved preference early
    const sidebarMode = localStorage.getItem('sidebarMode') === 'true';
    
    // Apply saved preference on page load
    if (sidebarMode) {
        document.body.classList.add('sidebar-mode');
    }
    
    // Toggle layout function
    window.toggleLayout = function() {
        document.body.classList.toggle('sidebar-mode');
        const isActive = document.body.classList.contains('sidebar-mode');
        localStorage.setItem('sidebarMode', isActive ? 'true' : 'false');
    };
    
    // Keep old name for backwards compatibility
    window.toggleSidebar = window.toggleLayout;
    
    // Debounce helper for improved performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Handle dropdown clicks in sidebar mode - with event delegation
    document.addEventListener('DOMContentLoaded', function() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        // Event delegation for better performance
        document.addEventListener('click', function(e) {
            if (!document.body.classList.contains('sidebar-mode')) return;
            
            const toggleButton = e.target.closest('.dropdown-toggle');
            if (!toggleButton) return;
            
            e.preventDefault();
            const dropdown = toggleButton.closest('.dropdown');
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
            
            // Close other dropdowns
            dropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.classList.remove('active');
                }
            });
        }, { passive: false });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (e.target.closest('.dropdown') || e.target.closest('.dropdown-toggle')) return;
            if (!document.body.classList.contains('sidebar-mode')) return;
            
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    });
})();
