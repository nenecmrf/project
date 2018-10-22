const http = require('http');
const Static = require('node-static');
const WebSocketServer = new require('ws');
const fs = require('fs')

// подключенные клиенты
var clients = {};

// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({port: 8081});


webSocketServer.on('connection', function(ws) {

  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);

  ws.on('message', function(message) {
    //console.log('получено сообщение ' + message);
	
	if (message === 'master'){
		var data = fs.readFileSync('masters.json');
		var masters = JSON.parse(data);
		console.log(JSON.stringify(masters));
		for(var key in clients) {
		  clients[key].send(JSON.stringify(masters));
		}
	}else if (message === 'time'){
		var data = fs.readFileSync('time.json');
		var time = JSON.parse(data);
		console.log(JSON.stringify(time));
		for(var key in clients) {
		  clients[key].send(JSON.stringify(time));
		}
	}else if (message === 'service'){
		console.log('service');
	}
  });

  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });

});


// обычный сервер (статика) на порту 8080
var fileServer = new Static.Server('.');
http.createServer(function (req, res) {
  
  fileServer.serve(req, res);
  
}).listen(8080);

console.log("Сервер запущен на портах 8080, 8081");

