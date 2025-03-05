const express = require('express');
const templateFiller = require('../controllers/templateFiller.js');
const router = express.Router();

// Define a route
router.get('/', (req, res) => {
    res.send('route for templates');
});

router.post('/templates', async (req, res) => {
    const fillInfo = req.body;

    parsed = await templateFiller.fillTemplates(fillInfo);
    templateFiller.zipTemplates();

    res.send(parsed);
})

// zip the templates and send to user
router.get('/templates', (req, res) => {
    res.send();
})

router.post('/templates/send', (req, res) => {
    const template = req.body.template;

    templateFiller.setTemplate(template);
    
    res.send(template);
})

router.post('/templates/clear', (req, res) => {
    parsed = templateFiller.clearTemplates();

    res.send({"Cleared": "True"});
})

module.exports = router;