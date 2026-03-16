// Newsletter Form Handler
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('newsletterForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = form.querySelector('input[name="name"]').value;
            const email = form.querySelector('input[name="email"]').value;
            const messageDiv = document.getElementById('newsletter-message');

            // Validate email
            if (!isValidEmail(email)) {
                showMessage('please enter a valid email address.', 'error');
                return;
            }

            // Disable button during submission
            const submitBtn = form.querySelector('.btn-subscribe');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Subscribing...';

            // Submit to Formspree
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    form.reset();
                    showMessage('thanks for subscribing! 🎉 Check your email for confirmation.', 'success');
                    setTimeout(() => {
                        messageDiv.classList.remove('show');
                    }, 5000);
                } else {
                    showMessage('something went wrong. please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('connection error. please try again.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });

        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function showMessage(message, type) {
            const messageDiv = document.getElementById('newsletter-message');
            messageDiv.textContent = message;
            messageDiv.className = `newsletter-message show ${type}`;
        }
    });
})();
