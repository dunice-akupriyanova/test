var WebSocketServer = require('websocket').server;
var User = require('./models/user');
var jwt = require("jwt-simple");
var cfg = require('./config/config');
var http = require('http');

var server = http.createServer(function(request, response) {});
server.listen(8080, function() {});

wsServer = new WebSocketServer({
    httpServer: server
});

var clients = {};

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        console.log('message=', message);
        if (JSON.parse(message.utf8Data).type == 'authenticate') {
            let id = jwt.decode(JSON.parse(message.utf8Data).payload.tokens.accessToken, cfg.jwtSecret).id;
            console.log('id=', id);
            User.findOne({ _id: id }, function(err, user) {
                if (err) return next(err);
                if (!user) { return; }
                console.log('user=', user);
                if (!clients[user._id]) {
                    clients[user._id] = [];
                }
                clients[user._id].push(connection);
            });
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});

module.exports = clients;