var express = require('express');
var bodyParser = require('body-parser');

var indexRouter = require('./indexRouter')();

var app = express();

var port = 5000;
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(('/'), indexRouter);
app.listen(port, function (err) {
    console.log('listening on ' + port);
});