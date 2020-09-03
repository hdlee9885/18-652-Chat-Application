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
		'<div class="message-container"><div class="message-info"><span class="message-name">'+name+' </span>'+
		'<div style="text-align: center"><span class="message-time">'+time+'</span></div></div>'+
		'<div class="message-content">'+message+'</div></div>'
	);
	var len = msg_list.height();
	msg_list.scrollTop(len);
});

socket.on("userIn",function(data){ 
	var msg_list = $(".message-list");
		msg_list.append( 
		'<div class="message-container"><div class="message-content message-system">'+data+'</div></div>'
	);
});
socket.on("userOut",function(data){ 
	var msg_list = $(".message-list");
		msg_list.append( 
		'<div class="message-container"><div class="message-content message-system">'+data+'</div></div>'
	);
});
socket.on("system",function(data){ 
	var msg_list = $(".message-list");
		msg_list.append( 
		'<div class="message-container"><div class="message-welcome">'+data+'</div></div>'
	);
});

socket.on("user_list",function(userList){ // retrieve user list
	$(".user-list").html("");

	for(var i=0;i<userList.length;i++){ 
		$(".user-list").append("<tr class='row'><td>"+userList[i].name+"</td></tr>");
	}
    var numOnline = $(".user-list").find("tr").length;
    if (numOnline == 1) {
        $("#list-count").text("Currently, " + numOnline + " user is online.");
    } else {
        $("#list-count").text("Currently, " + numOnline + " users are online.");
    }
});

function showChatHistory(){
    var username = $("#username_place span").html();
    console.log(username + "is getting history");
	var history_div = document.getElementById("message-history");
	if (history_div.style.display === "none") {
		document.getElementById("history-btn").innerHTML="Hide History";
		history_div.style.display = "block";
	} else {
		document.getElementById("history-btn").innerHTML="Show History";
		history_div.style.display = "none";
	}
	socket.emit("getChatHistory",username); 
}

function hideHistory() {
	var history_div = document.getElementById("message-history");
	if (history_div.style.display === "none") {
		history_div.style.display = "block";
		document.getElementById("history-btn").value="Show History";
		showChatHistory();
	  } else {
		history_div.style.display = "none";
	  }
}

socket.on("getChatHistoryDone",function(data){   // get chat history from database
    var history_list = $(".message-history");
    history_list.html("");
	for(var i=0;i<data.length;i++){ 
        history_list.append('<div class="message-container"><div class="message-info">'+
		'<div style="text-align: center"><span class="message-name">'+data[i].sender+' </span><span class="message-time">'+data[i].timestamps+'</span></div></div>'+
		'<div class="message-content">'+data[i].message+'</div></div>');
	}
});
