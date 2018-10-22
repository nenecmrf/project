if (!window.WebSocket) {
	document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
}

// создать подключение
var socket = new WebSocket("ws://localhost:8081");

var button = document.querySelector('div[data="order"]').addEventListener('click', function(e){
	var target = e.target;
	new Order(target);
});

function Order(item){
	this.master = function(action){
		socket.send(action);
		return false;
	};
	this.time = function(action){
		socket.send(action);
		return false;
	};
	this.service = function(action){
		socket.send(action);
		return false;
	};
	var action = item.getAttribute('data');
	var self = this;
	if (action){
		self[action](action);
	}
	
}

function getData(data){
	//console.log(data);
}

// обработчик входящих сообщений
socket.onmessage = function(event) {
  var incomingMessage = event.data;
  var ws = JSON.parse(incomingMessage);
  console.log(ws);
  console.log(ws.data);
  var data = ws.data;
  if (ws.type == "master"){
	    for (master in data){
			showMessage(data[master].name +' '+ data[master].surname+
			' '+ ((data[master].availability == 1)? 'Available' : 'Not available')); 
		}
  }else if(ws.type == "time"){
		for(year in data){
			showMessage(year); 
			for (time in data[year]){
				var dy = data[year];
				console.log(dy[time].day);
				showMessage('Месяц: '+ dy[time].month+' День: '+ dy[time].day
				+ 'Время: '+ dy[time].time);
			}	
		}
  }else if(ws.type == "service"){
	  
  }

};

// показать сообщение в div#subscribe
function showMessage(message) {
  var messageElem = document.createElement('div');
  messageElem.appendChild(document.createTextNode(message));
  document.getElementById('subscribe').appendChild(messageElem);
}
