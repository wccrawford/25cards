var express =require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var expressSession = require('express-session');
var RedisStore = require("connect-redis")(expressSession);
var shareSession = require('express-socket.io-session');

var secret = 'secret';
var port = process.env.SERVER_PORT || 8888;
var session = expressSession({
    store: new RedisStore({}),
    secret: secret,
    resave: true,
    saveUninitialized: true
});
app.use(session);
io.use(shareSession(session, {
    autoSave: true
}));

require('file?name=html/index.html!./html/index.html');
app.use(express.static(__dirname + '/html'));
// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/html/index.html');
// });
server.listen(port, function() {
    console.log('Listening on *:' + port);
}); // Both http and websockets servers on the same port
io.on('connection', function (socket) {
    // var name = 'Guest' + Math.ceil(Math.random() * 1000000);
    // console.log(socket.handshake.session);
    // console.log('got connection');
    if(!socket.handshake.session.name) {
        socket.handshake.session.name = 'Guest' + Math.ceil(Math.random() * 1000000);
    }
    socket.emit('news', { hello: 'world' });
    socket.on('message', function(message) {
        io.emit('message', socket.handshake.session.name + ': ' + message);
    });
    
    socket.on('setName', function(newName, callback) {
        let oldName = socket.handshake.session.name;
        io.emit('message', oldName + ' renamed to ' + newName);
        socket.handshake.session.name = newName;
        
        if(typeof(callback) == 'function') {
            callback(oldName, newName);
        }
    });
});
