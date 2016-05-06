var express =require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');
var expressSession = require('express-session');
var RedisStore = require("connect-redis")(expressSession);
var shareSession = require('express-socket.io-session');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

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

var bodyParser = require( 'body-parser' );
app.use( bodyParser.urlencoded({ extended: true }) );

app.use(passport.initialize());
app.use(passport.session());

require('file?name=html/index.html!./html/index.html');
require('file?name=html/login.html!./html/login.html');

passport.serializeUser(function(user,done){
    console.log('serialize', user);
    done(null, user.id); // the user id that you have in the session
});

passport.deserializeUser(function(id,done){
    console.log('deserialize', id);
    done(null, {id: id, name: id}); //generally this is done against user database as validation
});

app.get('/', function (req, res) {
    console.log(req.user);
    res.sendFile(__dirname + '/html/index.html');
});

passport.use('local',
    new LocalStrategy(
    function(username, password, done) {
        console.log(username, password);
        return done(null, {
            id: username,
            name: username
        });
        
        // User.findOne({ username: username }, function (err, user) {
        //     if (err) { return done(err); }
        //     if (!user) {
        //         return done(null, false, { message: 'Incorrect username.' });
        //     }
        //     if (!user.validPassword(password)) {
        //         return done(null, false, { message: 'Incorrect password.' });
        //     }
        //     return done(null, user);
        // });
    }
));

app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        console.log(req.user);
        console.log(req.session);
        req.session.name = req.user.name;
        res.redirect('/');
    }
);

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/html/login.html');
});

app.use(express.static(__dirname + '/html'));

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
