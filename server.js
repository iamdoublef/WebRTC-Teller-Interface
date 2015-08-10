console.log('init');

var express = require('express');
var app = express();
var server = require('http').createServer(app);
console.log('server:'+server);
var SkyRTC = require('skyrtc').listen(server);
console.log('SkyRTC:'+SkyRTC);
var path = require("path");
console.log('path'+ path);

var port = process.env.PORT || 3002;
console.log('port'+ port);

server.listen(port);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	
	res.sendfile(__dirname + '/index.html');
});

SkyRTC.rtc.on('new_call', function(socket) {
	console.log('create new call:'+socket.id);
});

SkyRTC.rtc.on('new_connect', function(socket) {
	console.log('create new connect');
});

SkyRTC.rtc.on('remove_peer', function(socketId) {
	console.log(socketId + ",use leave");
});

SkyRTC.rtc.on('new_peer', function(socket, room) {
	console.log("new peer:" + socket.id + ",into room:" + room);
});

SkyRTC.rtc.on('socket_message', function(socket, msg) {
	console.log("recv from:" + socket.id + ",new message:" + msg);
});

SkyRTC.rtc.on('ice_candidate', function(socket, ice_candidate) {
	console.log("recv from:" + socket.id + ",is ICE Candidate:" + ice_candidate);
});

SkyRTC.rtc.on('offer', function(socket, offer) {
	console.log("recv from:" + socket.id + ",is Offer");
});

SkyRTC.rtc.on('answer', function(socket, answer) {
	console.log("recv from:" + socket.id + ",is Answer");
});

SkyRTC.rtc.on('error', function(error) {
	console.log("error:" + error.message);
});