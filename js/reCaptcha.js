document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Execute reCAPTCHA v3
    grecaptcha.ready(function() {
        grecaptcha.execute('6LeWDR0rAAAAAOnwVttwP0-12lluELJP4RrqdX0r', {action: 'submit'}).then(function(token) {
            // Token received
            console.log("reCAPTCHA token:", token);
            
            // Display score (for demo purposes - you wouldn't normally show this)
            fetch(`https://www.google.com/recaptcha/api/siteverify?secret=6LeWDR0rAAAAAOnwVttwP0-12lluELJP4RrqdX0r=${token}`)
                .then(res => res.json())
                .then(data => {
                    document.getElementById('recaptchaBadge').innerHTML = 
                        `reCAPTCHA score: <span class="score-badge">${data.score}</span>`;
                    
                    if(data.score < 0.5) {
                        alert("This action looks suspicious. Please try again.");
                        return;
                    }
                    
                    // Proceed with form submission
                    alert("Form would submit here with score: " + data.score);
                });
        });
    });
});