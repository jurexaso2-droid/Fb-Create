const express = require('express');
const puppeteer = require('puppeteer');
const faker = require('faker');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your HTML file to talk to this server
app.use(express.json());

const PORT = 3000;

app.get('/run-automation', async (req, res) => {
    try {
        const BASE_URL = "https://api.guerrillamail.com/ajax.php";
        
        // 1. Get temporary email
        const mailRes = await axios.get(`${BASE_URL}?f=get_email_address`);
        const { email_addr, sid_token } = mailRes.data;
        const email = email_addr;
        
        // 2. Generate Fake Data
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        const password = "free123!@2026";

        // 3. Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: false, // Set to true if you don't want to see the window
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
        });

        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

        // 4. Navigate to Facebook
        await page.goto('https://www.facebook.com/reg/', { waitUntil: 'networkidle2' });

        // Optional: Fill out the form (Educational Example)
        // await page.type('input[name="firstname"]', firstName);
        // await page.type('input[name="lastname"]', lastName);
        // await page.type('input[name="reg_email__"]', email);

        // Keep browser open for a few seconds then close or return status
        res.json({ 
            status: "Success", 
            message: "Automation started", 
            data: { email, firstName, lastName } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "Error", message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});