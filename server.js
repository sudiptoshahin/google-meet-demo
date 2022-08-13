const express = require('express');

const app = express();

app.use('/public', express.static(`${__dirname}`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/action.html`);
});


app.listen(3000);