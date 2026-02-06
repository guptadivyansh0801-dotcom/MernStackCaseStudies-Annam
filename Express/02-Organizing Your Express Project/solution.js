// Code Walkthrough - app.js (Main Entry Point)
const express = require('express');
const app = express();
const eventsRouter = require('./routes/events');
const classesRouter = require('./routes/classes');

app.use(express.json());

// Mount routers
app.use('/events', eventsRouter);
app.use('/classes', classesRouter);

// Static files
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
    res.send('Welcome to Greenfield Community Center!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Community Center server running at http://localhost:${port}`);
});

// Code Walkthrough - routes/events.js
/*
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const events = [
        'Yoga Class - Monday 7pm',
        'Gardening Workshop - Wednesday 5pm',
        'Book Club - Friday 6pm'
    ];
    res.json(events);
});

module.exports = router;
*/

// Code Walkthrough - routes/classes.js
/*
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json([
        'Art Class - Tuesday 4pm',
        'Music Class - Thursday 3pm'
    ]);
});

module.exports = router;
*/

// Challenge: Create /contact route in a separate file
// routes/contact.js
/*
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        email: 'info@greenfieldcc.org',
        phone: '123-456-7890',
        address: '123 Main St, Greenfield'
    });
});

module.exports = router;
*/
