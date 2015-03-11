var express = require('express');
var bodyParse = require('body-parser');

var app = express();
var api = require('./api/index.js');

app.use(bodyParse.json());

app.use(express.static('public'));

app.get('/api/buns', api.getBuns);

app.post('/api/buns', api.createBun);

app.post('/api/buns/delete', api.deleteBun);

app.listen('4005');

