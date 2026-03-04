// Scroll Animation Observer - Optimized for performance
(function() {
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    
    // Use passive listener and optimized options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Unobserve after triggering to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeInSections.forEach(section => {
        observer.observe(section);
    });
    
    // Cleanup function
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });
})();
