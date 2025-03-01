const express = require('express');
const templateFiller = require('../controllers/templateFiller');
const router = express.Router();

// Define a route
router.get('/', (req, res) => {
    res.send('route for templates');
});

router.post('/csv', (req, res) => {
    const csv = req.body;

    parsed = templateFiller.parseCSV(csv);

    res.send(parsed);
})

module.exports = router;