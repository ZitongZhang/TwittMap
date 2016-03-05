var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');


var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);

var client = new elasticsearch.Client({
    host: 'https://search-twittmap-qtnxkqs26tfzc27letgg2blf5i.us-east-1.es.amazonaws.com:443'
});

server.listen(2222);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/routes/twittmap.html');
});

io.on('connection', function (socket) {
    socket.emit('news', {message: 'welcome!', id: socket.id});//Note that emit event name on the server matches the emit event name

    socket.on('my other event', function (data) {
        var key = data.key;
        client.search({
            q: key,
            size: 1000
        }, function (error, body) {
            var result = [];
            var hits = body.hits.hits;
            for (var i = 0; i < hits.length; i++) {
                result[i] = hits[i]._source;
            }
            var myObject = {
                "tweet": result
            };
            socket.emit('toggle', myObject);
        });
    });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes')));

//app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

console.log("Server running on 2222");
module.exports = app;
