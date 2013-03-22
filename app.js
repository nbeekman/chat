 
/**
 * Module dependencies.
 */

var express = require('express')
  , route = require('./config/route')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongo')(express);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.locals.title = "Welcome to Chat";
  
  //mongo db connection
  mongoose.connect('mongodb://localhost/chat_DEV');
  
  app.use(express.session({
    secret: "Ahmed how did you know about who done it in the lounge?",
    store: new MongoStore({
      mongoose_connection: mongoose.connection,
      db: 'chat_DEV'
    })
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

passport.serializeUser(function(user, done) { //passport stuff should be in separate file
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var GoogleStrategy = require('passport-google').Strategy;
var UserModel = require('./models/usermodel');

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(identifier, profile, done) {//capturing data for mongoose
    profile.email = profile.emails[0].value;
    UserModel.findOneAndUpdate({email:profile.email}, {$set:profile, $inc:{logins:1}}, {upsert: true}, done);

    console.log(arguments);

  }
));

route(app);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

//socket io stuff
io.sockets.on('connection', function (socket) {//callback that binds only that socket
  
  socket.emit('message', {message:"Connected to Chat", from:"system"});
  
  socket.on('join', function(data){
    socket.join(data.room); //join room that's named room id
    socket.broadcast.to(data.room).emit('message', {message:data.from+" joined the room", from:"system"});
    socket.emit('message', {message:"You haved joined room "+data.room, from:"system"});
  });
  
  socket.on('leave', function(data){
    socket.leave(data.room);
    socket.broadcast.to(data.room).emit('message', {message:data.from+" left the room.", from:"system"});
  });
  
  socket.on('message', function(data){ 
    socket.broadcast.to(data.room).emit('message', data);
  });
  
  

});