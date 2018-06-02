const express = require('express');

const app = express();
const server = app.listen(7070, () => {
    console.log('Started on port 7070');
});

app.use(express.static('public'));