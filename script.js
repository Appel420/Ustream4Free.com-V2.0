document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginButton');
    const loginLight1 = document.getElementById('loginLight1');
    const loginLight2 = document.getElementById('loginLight2');
    const loginLight3 = document.getElementById('loginLight3'); 
    const loginStatusText = document.getElementById('loginStatusText');

    let isLoggedIn = false; // Initial state

    loginButton.addEventListener('click', function() {
        // Simulate a login/logout toggle for demonstration
        isLoggedIn = !isLoggedIn; 

        if (isLoggedIn) {
            // User is logged in
            loginLight1.classList.remove('red');
            loginLight1.classList.add('green');
            loginLight2.classList.remove('red'); 
            loginLight2.classList.add('green');
            // loginLight3 is already green by default, no change needed unless specific logic is desired
            loginStatusText.textContent = "Logged in";
            loginStatusText.style.color = '#00ff00'; // Green text for logged in
        } else {
            // User is logged out
            loginLight1.classList.remove('green');
            loginLight1.classList.add('red');
            loginLight2.classList.remove('green'); 
            loginLight2.classList.add('red');
            // Keep loginLight3 green as per your design
            loginStatusText.textContent = "Logged out";
            loginStatusText.style.color = '#e0e0e0'; // Revert to original color
        }

        // In a real application, send username/password to a server
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        console.log("Attempted login with:", username, password); 
    });
});