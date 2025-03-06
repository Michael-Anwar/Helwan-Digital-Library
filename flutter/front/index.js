const express = require('express');
const history = require('connect-history-api-fallback');
const app = express();

app.use(history());
app.use(express.static('build'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
