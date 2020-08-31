// var io = require('socket.io')(3000);
// var app = require('express');
// var server = require('http').createServer(app);
// var socket = require('socket.io')(server);
// server.listen(3000);
// var socket = io('ws://localhost:3000');
var socket = io();

socket.on("connect", function(){
    var username = $("#username_place span").html();
    socket.send(username);
    console.log("send username: " + username + " to server");
});

function sendMessage() {
    var message = $("#msgIn").val();
    console.log(message);
    if (message == "") return;
    socket.emit("say",message);
    $("#msgIn").val("");  
    console.log("Clicked");
}

socket.on("user_say",function(name,time,content){ // show chat message
	console.log("user: "+name + "say: "+content);
	var msg_list = $(".msg-list");
	msg_list.append( 
		'<div class="msg-wrap"><div class="msg-info"><span class="msg-name">'+name+' </span>'+
		'<span class="msg-time">'+time+' </span><span class="glyphicon glyphicon-bullhorn"></span></div>'+
		'<div class="msg-content">'+content+'</div></div>'
	);
	var len = msg_list.height();
	msg_list.scrollTop(len);
});

socket.on("userIn",function(data){ 
	var msg_list = $(".msg-list");
		msg_list.append( 
		'<div class="msg-wrap"><div class="msg-content msg-system">'+data+'</div></div>'
	);
});
socket.on("userOut",function(data){ 
	var msg_list = $(".msg-list");
		msg_list.append( 
		'<div class="msg-wrap"><div class="msg-content msg-system">'+data+'</div></div>'
	);
});
socket.on("system",function(data){ 
	var msg_list = $(".msg-list");
		msg_list.append( 
		'<div class="msg-wrap"><div class="msg-content msg-welcome">'+data+'</div></div>'
	);
});

socket.on("user_list",function(userList){ // retrieve user list
	$(".user-list").html("");

	for(var i=0;i<userList.length;i++){ 
		$(".user-list").append("<tr class='row'><td>"+userList[i].name+"</td></tr>");
	}
    var numOnline = $(".user-list").find("tr").length;
    if (numOnline == 1) {
        $("#list-count").text("Currently, " + numOnline + " person is online.");
    } else {
        $("#list-count").text("Currently, " + numOnline + " people are online.");
    }
});

function showChatHistory(){
    var username = $("#username_place span").html();
    console.log(username + "is getting history");
    socket.emit("getChatHistory",username); 
}

socket.on("getChatHistoryDone",function(data){   // get chat history from database
	$(".chat-list").html("");
	$(".chat-list").append("<tr class='row'><th class='col-sm-1'> ID </th><th class='col-sm-4'> Time </th><th class='col-sm-8'> Content </th></tr>");
	for(var i=0;i<data.length;i++){ 
		$(".chat-list").append("<tr class='row'><td class='col-sm-1'>"+(i+1)+"</td><td class='col-sm-3'>"+data[i].timestamps+"</td><td class='col-sm-8'>"+data[i].message+"</td></tr>");
	}
});
