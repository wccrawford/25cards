var express =require('express');
var app = express();
var server = require('http').createServer(app);
var ioServer = require('socket.io');
var path = require('path');
var expressSession = require('express-session');
var RedisStore = require("connect-redis")(expressSession);
var shareSession = require('express-socket.io-session');
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var redis = require('redis');
var redisClient = redis.createClient();
var seedrandom = require('seedrandom');
import shuffle from './js/shuffle';
var nounlist = require('./data/nounlist2.json');

var secret = 'secret';
var port = process.env.SERVER_PORT || 8888;
var session = expressSession({
    store: new RedisStore({}),
    secret: secret,
    resave: true,
    saveUninitialized: true
});
app.use(session);
var io = new ioServer();
io.use(shareSession(session, {
    autoSave: true
}));

var bodyParser = require( 'body-parser' );
app.use( bodyParser.urlencoded({ extended: true }) );

app.use(passport.initialize());
app.use(passport.session());

require('file?name=html/index.html!./html/index.html');
require('file?name=html/viewer.html!./html/viewer.html');
require('file?name=html/master.html!./html/master.html');
require('file?name=html/cast-receiver.html!./html/cast-receiver.html');

passport.serializeUser(function(user,done){
    done(null, user.id); // the user id that you have in the session
});

passport.deserializeUser(function(id,done){
    done(null, {id: id, name: id}); //generally this is done against user database as validation
});

app.get('/', function (req, res) {
    req.session.game_id = null;
    req.session.view_type = null;
    res.sendFile(__dirname + '/html/index.html');
});

app.get('/viewer/:game_id', function (req, res) {
    req.session.game_id = req.params.game_id;
    req.session.view_type = 'viewer';
    res.sendFile(__dirname + '/html/viewer.html');
});

app.get('/master/:game_id', function (req, res) {
    req.session.game_id = req.params.game_id;
    req.session.view_type = 'master';
    res.sendFile(__dirname + '/html/master.html');
});

passport.use('local',
    new LocalStrategy(
    function(username, password, done) {
        return done(null, {
            id: username,
            name: username
        });
    }
));

app.use(express.static(__dirname + '/html'));

server.listen(port, function() {;
    console.log('Listening on *:' + port);
}); // Both http and websockets servers on the same port

io.attach(server);

function setCards(socket, room, cards) {
    io.sockets.in(room).emit('setCards', {
        id: socket.handshake.session.game_id,
        cards: cards
    });
}

io.on('connection', function (socket) {
    socket.on('message', function(message) {
        io.emit('message', socket.handshake.session.name + ': ' + message);
    });

    if(socket.handshake.session.game_id) {
        let game_id = socket.handshake.session.game_id;
        socket.room = 'game:'+game_id;

        socket.join(socket.room);
        redisClient.get(socket.room, function(err, value) {
            let cards = JSON.parse(value);

            setCards(socket, socket.room, cards);
        });
    }

    socket.on('createGame', function(message) {
        let id = Math.floor(seedrandom()() * 1000000).toString(15);
        let random = new seedrandom(id);
        let words = shuffle(nounlist, random).slice(0,25);
        let cards = words.map(function(word, index) {
            let cardType = 'nothing';
            if(index < 9) {
                cardType = 'team1';
            } else if (index < 17) {
                cardType = 'team2';
            } else if (index == 24) {
                cardType = 'killer';
            }
            return {
                word: word,
                type: cardType,
                flipped: false
            }
        });
        let shuffledCards = shuffle(cards, random);
        redisClient.setex('game:'+id, 60*60*24, JSON.stringify(shuffledCards));
        socket.emit('startGame', {
            game_id: id
        });
    });

    socket.on('setCards', function(cards) {
        if(socket.room) {
            redisClient.setex(socket.room, 60*60*24, JSON.stringify(cards));

            setCards(socket, socket.room, cards);
        }
    });
});
