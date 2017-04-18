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
        if (JSON.parse(message.utf8Data).type == 'authenticate') {
            if (!JSON.parse(message.utf8Data).payload.tokens) return;
            let id = jwt.decode(JSON.parse(message.utf8Data).payload.tokens.accessToken, cfg.jwtSecret).id;
            User.findOne({ _id: id }, function(err, user) {
                if (err || !user) return;
                if (!clients[user._id]) {
                    clients[user._id] = [];
                }
                clients[user._id].push(connection);
            });
        }
    });

    connection.on('close', function(reasonCode, description) {
        for (key in clients) {
            let index = clients[key].findIndex((element) => element == connection);
            if (index != -1) {
                clients[key].splice(index, 1);
            }
        }
    });
});

module.exports = clients;