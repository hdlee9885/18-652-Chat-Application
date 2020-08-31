// var http = require('http');
// var express = require('express');
// var app = express();
// var server = http.createServer(app);
// var socketIO = require('socket.io');
// var socket = socketIO(server);

// var clients = new Array();

// function getTime(){   // get time format
// 	var date = new Date();
// 	var time = "("+date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+")";
// 	return time;
// }

// function saveChatHistory(name, history, time) {
//     var chat = mongoose.model('Chat');
//     chat.create({
//         message: history,
//         sender: name,
// 		timestamps: time
// 	},function(err,doc){ 
// 		if(err){ 
// 			console.log(err);
// 		}else{ 
// 			console.log("history saved: success");
// 		}
// 	});
// }

// function getOnlineUser(s){
//     var user = mongoose.model('Users');
//     user.find({status: "up"},function(err,docs){ 
//         if(err){ 
//             console.log(err);
//         }else{ 
//             console.log('users list --default: ' + docs);
//             s.broadcast.emit('user_list',docs); // update user list
//             s.emit('user_list',docs);
//         }
//     });
// }

// socket.on('connection', function(socket) {
//     console.log('socket.id '+socket.id+ ': connecting'); // print user on console when joining
//     getOnlineUser(socket);
//     var client = {  // create client object
//         Socket: socket,
//         name: 'unknown'
//     };
//     socket.on("message", function(name){
//         client.name = name;  // store client name
//         clients.push(client);  // store client object in array
//         console.log("client name: " + client.name); // print client on console
//       	socket.broadcast.emit("userIn","We have a new user joining in " + client.name);
//     })
//     socket.emit("system","system@: Welcome!"); 

//     // group chat
//     socket.on('say',function(content) {
// 		console.log("server: "+ client.name + " typed : " + content);
// 		// store info in database
// 		var time = getTime();
// 		socket.emit('user_say',client.name,time,content);
// 		socket.broadcast.emit('user_say',client.name,time,content);
// 		saveChatHistory(client.name,content,time);   // save chat history
//     });

//     socket.on('getChatList',function(username){
//         var history = moogoose.model('Chat');
//         history.find({sender: username},function(err,docs){ 
// 			if(err){ 
// 				console.log(err);
// 			}else{
// 				socket.emit("getChatListDone",docs);
// 				console.log(username + " is looking for chat history");
// 			}
// 		});
//     })

//     socket.on('disconnect', function(){
//         var name = "";
//         for (var c in cients) {
//             if(clients[c].Socket == socket) {
//                 name = clients[c].name;
//             }
//         }
//         userGoOffline(name,socket);
//         socket.broadcast.emit('userOut',"system@: "+client.name+" left");
// 		console.log(client.name + ': disconnected');
//     });
    
// })

// function userGoOffline(name,ssocket){ // make user go offline
// 	var user = mongoose.model('Users');  
// 	user.update({name:name},{$set: {status: 'offline'}},function(err,doc){ 
// 		if(err){ 
// 			console.log(err);
// 		}else{ 
// 			console.log(name+ " is offline");
// 			getOnlineUser(ssocket);
// 		}
// 	});
// }

// exports.listen = function(charServer){    
// 	return socket.listen(charServer);
// };