var WebSocketServer = require('websocket').server;
var User = require('./models/user');
var jwt = require("jwt-simple");
var cfg = require('./config/config'); 
var http = require('http');

var server = http.createServer(function(request, response) {
});
server.listen(8080, function() { });

wsServer = new WebSocketServer({
    httpServer: server
});


var server2 = http.createServer(function(request, response) {
});
server.listen(8088, function() { });

wsServer2 = new WebSocketServer({
    httpServer: server2
});



// var clients = [];
var clients = {};

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    // clients.push(connection);
    connection.on('message', function(message) {
        // if (message.type === 'utf8') {
        //     // process WebSocket message
        // }
        console.log('message=', message);
        if (JSON.parse(message.utf8Data).type=='authenticate'){
            let id = jwt.decode(JSON.parse(message.utf8Data).payload.tokens.accessToken, cfg.jwtSecret).id;
            console.log('id=', id);
            User.findOne({_id: id}, function(err,user){
                if (err) return next(err);
                if (user) {
                    console.log('user=', user);
                    if (!clients[user._id]) {
                        clients[user._id] = [];
                    }
                    // console.log('connection=', connection);
                    // connection.sendUTF(JSON.stringify(connection));
                    clients[user._id].push(connection);
                    // console.log(clients);
                }
            });
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});

module.exports = clients;