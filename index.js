const http = require('http');
const querystring = require('querystring'); // To parse form data

const PORT = 3000;

// Helper function to generate a consistent HTML layout with navigation
const renderPage = (title, content) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - The Soulful Shayar</title>
        <style>
            body {
                font-family: 'Georgia', 'Times New Roman', serif; /* Serif font for poetry vibe */
                margin: 0;
                padding: 0;
                background-color: #faf3e0; /* Warm paper-like background */
                color: #4a4a4a;
                line-height: 1.8;
            }
            nav {
                background-color: #5d4037; /* Earthy brown tone */
                padding: 1rem 2rem;
                box-shadow: 0 4px 6px rgba(0,0,0,0.2);
                text-align: center;
            }
            nav a {
                color: #efebe9;
                text-decoration: none;
                margin: 0 15px;
                font-family: -apple-system, sans-serif; /* Keep nav simple sans-serif */
                font-weight: 500;
                font-size: 1.1rem;
                transition: color 0.3s ease;
            }
            nav a:hover {
                color: #d7ccc8;
                text-decoration: underline;
            }
            main {
                max-width: 800px;
                margin: 40px auto;
                padding: 40px;
                background: white;
                border-radius: 4px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                border: 1px solid #e0e0e0;
            }
            h1 {
                color: #3e2723;
                text-align: center;
                border-bottom: 1px solid #d7ccc8;
                padding-bottom: 20px;
                margin-bottom: 30px;
                font-style: italic;
            }
            .shayari-card {
                background: #fff8f0;
                border-left: 5px solid #8d6e63;
                padding: 20px;
                margin-bottom: 25px;
                font-size: 1.2rem;
                font-style: italic;
            }
            .shayari-card .author {
                display: block;
                text-align: right;
                font-size: 0.9rem;
                color: #888;
                margin-top: 10px;
                font-style: normal;
            }
            .feedback-form {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .feedback-form input, .feedback-form textarea {
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-family: inherit;
                font-size: 1rem;
            }
            .button {
                display: inline-block;
                background: #5d4037;
                color: white;
                padding: 10px 25px;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 10px;
                border: none;
                cursor: pointer;
                font-family: sans-serif;
                text-align: center;
            }
            .button:hover {
                background: #4e342e;
            }
            footer {
                text-align: center;
                margin-top: 50px;
                padding-bottom: 20px;
                color: #8d6e63;
                font-size: 0.9rem;
                font-family: sans-serif;
            }
        </style>
    </head>
    <body>
        <nav>
            <a href="/">Home</a>
            <a href="/love">Love Shayari</a>
            <a href="/sad">Sad Shayari</a>
            <a href="/submit">Submit Poetry</a>
            <a href="/feedback">Feedback</a>
        </nav>
        <main>
            <h1>${title}</h1>
            ${content}
        </main>
        <footer>
            &copy; 2024 The Soulful Shayar | Running on Node.js
        </footer>
    </body>
    </html>
  `;
};

const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0].replace(/\/$/, "") || "/";
    const method = req.method;

    console.log(`${method} request received for: ${url}`);

    // Handle POST requests (Form Submissions) separately
    if (method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = querystring.parse(body);

            if (url === '/feedback') {
                console.log('New Feedback Received:', formData);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(renderPage('Thank You!', `
                    <div style="text-align: center;">
                        <p>Shukriya, <strong>${formData.name}</strong>!</p>
                        <p>Your feedback has been received and is appreciated.</p>
                        <a href="/" class="button">Return Home</a>
                    </div>
                `));
            } 
            else if (url === '/submit') {
                console.log('New Poem Submitted:', formData);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(renderPage('Submission Received', `
                    <div style="text-align: center;">
                        <p>Beautiful words! We will review your submission shortly.</p>
                        <a href="/submit" class="button">Submit Another</a>
                    </div>
                `));
            }
            else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
        return; // Stop execution to wait for data events
    }

    // GET Request Routing Logic
    switch (url) {
        case '/':
        case '/home':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderPage('Welcome to The Soulful Shayar', `
                <p style="text-align: center; font-size: 1.2rem;">
                    "Words are but pictures of our thoughts."
                </p>
                <p>Welcome to a sanctuary for poetry lovers. Explore our collection of heartfelt Shayaris, 
                or contribute your own verses to our growing community.</p>
                
                <div class="shayari-card">
                    "Hazaaron khwahishen aisi ke har khwahish pe dam nikle,<br>
                    Bohat niklay mere armaan, lekin phir bhi kam nikle."
                    <span class="author">- Mirza Ghalib</span>
                </div>

                <div style="text-align: center; margin-top: 30px;">
                    <a href="/love" class="button">Read Love Shayari</a>
                    <a href="/sad" class="button" style="background: #795548;">Read Sad Shayari</a>
                </div>
            `));
            break;

        case '/love':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderPage('Love Shayari', `
                <p>Verses that speak the language of the heart.</p>
                
                <div class="shayari-card">
                    "Tere ishq mein humne kya kya na dekha,<br>
                    Kabhi khud ko khoya, kabhi tujhko paaya."
                    <span class="author">- Unknown</span>
                </div>

                <div class="shayari-card">
                    "Mohabbat mein nahi hai farq jeene aur marne ka,<br>
                    Usi ko dekh kar jeete hain jis kaafir pe dam nikle."
                    <span class="author">- Mirza Ghalib</span>
                </div>

                <div class="shayari-card">
                    "Kuch toh baat hai teri fitrat mein aye dost,<br>
                    Warna tujhe yaad karne ki khata hum baar baar na karte."
                    <span class="author">- Anonymous</span>
                </div>
            `));
            break;

        case '/sad':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderPage('Sad Shayari', `
                <p>Melancholy echoes of a broken heart.</p>
                
                <div class="shayari-card">
                    "Dil hi to hai na sang-o-khisht dard se bhar na aaye kyun,<br>
                    Royenge hum hazaar baar koi humein sataye kyun."
                    <span class="author">- Mirza Ghalib</span>
                </div>

                <div class="shayari-card">
                    "Main akela hi chala tha janib-e-manzil magar,<br>
                    Log saath aate gaye aur karwaan banta gaya."
                    <span class="author">- Majrooh Sultanpuri</span>
                </div>
            `));
            break;

        case '/submit':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderPage('Submit Your Poetry', `
                <p>Share your own words with the world.</p>
                <form action="/submit" method="POST" class="feedback-form">
                    <label>Your Name/Pen Name:</label>
                    <input type="text" name="author" required placeholder="e.g. Rahat Indori">
                    
                    <label>Your Shayari:</label>
                    <textarea name="poem" rows="5" required placeholder="Write your verses here..."></textarea>
                    
                    <button type="submit" class="button">Submit Poem</button>
                </form>
            `));
            break;

        case '/feedback':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderPage('Feedback', `
                <p>We would love to hear your thoughts on our collection.</p>
                <form action="/feedback" method="POST" class="feedback-form">
                    <label>Your Name:</label>
                    <input type="text" name="name" required placeholder="John Doe">
                    
                    <label>Your Email:</label>
                    <input type="email" name="email" required placeholder="john@example.com">
                    
                    <label>Message:</label>
                    <textarea name="message" rows="4" required placeholder="What do you think about the website?"></textarea>
                    
                    <button type="submit" class="button">Send Feedback</button>
                </form>
            `));
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(renderPage('404 Not Found', `
                <h2 style="color: #d32f2f; text-align: center;">Page Not Found</h2>
                <p style="text-align: center;">Even the best poets lose their way sometimes.</p>
                <div style="text-align: center;">
                    <a href="/" class="button">Return Home</a>
                </div>
            `));
            break;
    }
});

server.listen(PORT, () => {
    console.log(`Shayar Server is running at http://localhost:${PORT}`);
});