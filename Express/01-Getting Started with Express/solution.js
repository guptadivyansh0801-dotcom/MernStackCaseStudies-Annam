// Code Walkthrough - Creating the Express App
const express = require('express');
const app = express();
const port = 3000;

// Code Walkthrough - Defining Routes
app.get('/', (req, res) => {
    res.send('Welcome to Greenfield Community Center!');
});

// Code Walkthrough - Events Route
app.get('/events', (req, res) => {
    const events = [
        'Yoga Class - Monday 7pm',
        'Gardening Workshop - Wednesday 5pm',
        'Book Club - Friday 6pm'
    ];
    res.json(events);
});

// Challenge: Contact Route
app.get('/contact', (req, res) => {
    res.json({
        email: 'info@greenfieldcc.org',
        phone: '123-456-7890'
    });
});

// Code Walkthrough - Starting the Server
app.listen(port, () => {
    console.log(`Community Center server running at http://localhost:${port}`);
});
