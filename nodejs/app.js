var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

server.listen(2222);

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'https://search-twittmap-qtnxkqs26tfzc27letgg2blf5i.us-east-1.es.amazonaws.com:443'
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