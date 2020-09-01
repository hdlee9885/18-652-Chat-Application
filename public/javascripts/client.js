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
    socket.emit("send",message);
    $("#msgIn").val("");  
    console.log("Clicked");
}

socket.on("user_send",function(name,message,time){ // show chat message
    console.log("user: "+name + "send: "+message);
	var msg_list = $(".message-list");
	msg_list.append( 
		'<div class="message-wrap"><div class="message-info"><span class="message-name">'+name+' </span>'+
		'<span class="message-time">'+time+' </span><span class="glyphicon glyphicon-bullhorn"></span></div>'+
		'<div class="message-content">'+message+'</div></div>'
	);
	var len = msg_list.height();
	msg_list.scrollTop(len);
});

socket.on("userIn",function(data){ 
	var msg_list = $(".message-list");
		msg_list.append( 
		'<div class="message-wrap"><div class="message-content message-system">'+data+'</div></div>'
	);
});
socket.on("userOut",function(data){ 
	var msg_list = $(".message-list");
		msg_list.append( 
		'<div class="message-wrap"><div class="message-content message-system">'+data+'</div></div>'
	);
});
socket.on("system",function(data){ 
	var msg_list = $(".message-list");
		msg_list.append( 
		'<div class="message-wrap"><div class="message-content message-welcome">'+data+'</div></div>'
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
    var history_list = $(".message-history");
    history_list.html("");
    // history_list.append("<tr class='row'><th class='col-sm-1'> ID </th><th class='col-sm-4'> Time </th><th class='col-sm-8'> Content </th></tr>");
	for(var i=0;i<data.length;i++){ 
        // history_list.append("<tr class='row'><td class='col-sm-1'>"+(i+1)+"</td><td class='col-sm-3'>"+data[i].timestamps+"</td><td class='col-sm-8'>"+data[i].message+"</td></tr>");
        history_list.append('<div class="message-container"><div class="message-info"><span class="message-name">'+data[i].sender+' </span>'+
		'<span class="message-time">'+data[i].timestamps+' </span><span class="glyphicon glyphicon-bullhorn"></span></div>'+
		'<div class="message-content">'+data[i].message+'</div></div>');
	}
});
