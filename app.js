var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var multer = require('multer');
var http = require('http');
var socketIO = require('socket.io');

// mongoose as object modeling tool
var mongoose = require('mongoose');
const uri = "mongodb+srv://hdlee9885:Lihaosong2@cluster0-j9rvf.mongodb.net/nodedb?retryWrites=true&w=majority";
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Get the default connection
var db = mongoose.connection;
// bind connection to error event
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var userModel = require('./database/model');
var chatModel = require('./database/model');

var session = require('express-session');
var app = express();
app.use(session({ 
  secret: 'secret',
  cookie:{ 
      maxAge: 1000*60*30
  },
  resave: true,
  saveUninitialized: true
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { title } = require('process');

// view engine setup
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));
// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){ 
  res.locals.user = req.session.user;  // get user from session
  var err = req.session.error;  // get error message
  delete req.session.error;
  res.locals.message = "";
  if(err){
      res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
  }
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',indexRouter);
app.use('/register',indexRouter);
app.use('/home',indexRouter);
app.use("/logout",indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3000, ()=> {
//   console.log("server is now on 3000");
// })


var server = http.createServer(app);
var socket = socketIO.listen(server);

var clients = new Array();

function getTime(){   // get time format
	var date = new Date();
	var time = "("+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+")";
	return time;
}

function saveChatHistory(name, history, time) {
    var chat = mongoose.model('Chat');
    chat.create({
        message: history,
        sender: name,
		    timestamps: time
	},function(err,doc){ 
		if(err){ 
			console.log(err);
		}else{ 
			console.log("history saved: success");
		}
	});
}

function getOnlineUser(s){
    var user = mongoose.model('Users');
    user.find({status: "online"},function(err,status){ 
        if(err){ 
            console.log(err);
        }else{ 
            console.log('users list --default: ' + status);
            s.broadcast.emit('user_list',status); // update user list
            s.emit('user_list',status);
        }
    });
}

socket.on('connection', function(socket) {
    console.log('socket.id '+socket.id+ ': connecting'); // print user on console when joining
    getOnlineUser(socket);
    var client = {  // create client object
        Socket: socket,
        name: 'unknown'
    };
    socket.on("message", function(name){
        client.name = name;  // store client name
        clients.push(client);  // store client object in array
        console.log("client name: " + client.name); // print client on console
      	socket.broadcast.emit("userIn","We have a new user joining in called" + client.name);
    });
    socket.emit("system","Chatroom@: Welcome!"); 

    // group chat
    socket.on('send',function(message) {
      console.log("server: "+ client.name + " typed : " + message);
      // store info in database
      var time = getTime();
      socket.emit('user_send',client.name,message,time);
      socket.broadcast.emit('user_send',client.name,message,time);
      saveChatHistory(client.name,message,time);   // save chat history
    });

    socket.on('getChatHistory',function(username){
      console.log("searching for chat history");
      var history = mongoose.model('Chat');
      history.find(function(err,chat){ 
			if(err){ 
				console.log(err);
			}else{
				socket.emit("getChatHistoryDone",chat);
        console.log(username + " is looking for chat history");
        console.log(chat);
			}
		});
    });

    socket.on('disconnect', function(){
        var name = "";
        for (var c in clients) {
            if(clients[c].Socket == socket) {
                name = clients[c].name;
            }
        }
        userGoOffline(name,socket);
        socket.broadcast.emit('userOut',"Chatroom@: "+client.name+" left");
		    console.log(client.name + ': disconnected');
    });
    
});

function userGoOffline(name,ssocket){ // make user go offline
	var user = mongoose.model('Users');  
	user.update({name:name},{$set: {status: 'offline'}},function(err,doc){ 
		if(err){ 
			console.log(err);
		}else{ 
			console.log(name+ " is offline");
			getOnlineUser(ssocket);
		}
	});
}

exports.listen = function(charServer){    
	return socket.listen(charServer);
};
// var port = process.env.PORT || 3000;
server.listen(8000, ()=> {
  console.log('server is on port 8000');
})

module.exports = app;
