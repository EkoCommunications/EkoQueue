const kue = require('kue');
const express = require('express');
const ui = require('kue-ui');
const app = express();
const prefix = process.env.PREFIX || 'ekoqueue';
const port = process.env.PORT || 2389;

kue.createQueue({ prefix });

ui.setup({ apiURL: '/api', baseURL: '/' });

app.use('/api', kue.app);
app.use('/', ui.app);
app.listen(port);

console.log(`kue server running: http://localhost:${port}`);
