var WebSocketServer = require('websocket').server;
var jwt = require("jwt-simple");
var cfg = require('./config/config'); 
var http = require('http');

var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(8080, function() { });

wsServer = new WebSocketServer({
    httpServer: server
});

var clients = [];

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    clients.push(connection);
    // connection.sendUTF(JSON.stringify('123456'));

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
        }
        if (JSON.parse(message.utf8Data).type=='authenticate'){
            console.log(cfg.jwtSecret);
            console.log('message', jwt.decode(JSON.parse(message.utf8Data).payload.tokens.accessToken, cfg.jwtSecret));
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});

module.exports = clients;