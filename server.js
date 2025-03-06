const express = require('express');
const path = require('path');

const app = express();

//middleware
app.use(express.json({limit: '50mb'}));

// static and main index
app.use('/dist', express.static(path.join(__dirname + '/dist')));

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, './public/index.html'));

});


// routes
const templates = require('./src/routes/template');

app.use('/templates', templates);


app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));
