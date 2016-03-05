var express = require('express');
var path = require('path');
var elasticsearch = require('elasticsearch');
var http = require('http');
var fs = require('fs');
var router = express.Router();
router.use(express.static(path.join(__dirname, 'scripts')));



/* GET home page. */

router.get('/', function (req, res) {
    var options = {
        root: __dirname + '/',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
            title: 'Twitter-map'
        }
    };
    var fileName = 'twittermap.html';
    //res.send(options.root + "");
    res.sendfile(fileName, options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });

    //It will find and locate index.html from View or Scripts

});



function onRequest(request, response) {
    if (request.method == 'GET' && request.url == '/') {
        response.writeHead(200, {"Content-Type": "text/html"});
        fs.createReadStream("./twittermap.html").pipe(response);
    }else {
        send404Response(response);
    }
}

var app = http.createServer(onRequest);

var io = require('socket.io').listen(app);
io.on('connection',function(socket){
    console.log('a user connected');
    socket.emit('filter', { message: 'filter!', id: socket.id });//Note that emit event name on the server matches the emit event name

    socket.on('key',function(data){    //of the client in this case.
        var key = data.message;
        console.log(key);
        var result = searchKey(key);
        console.log(result.length);
        socket.emit('tweets', {message: result});
    });
    app.use('/', routes);

});


module.exports = router;

