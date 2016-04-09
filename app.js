var http = require('http');
var fs = require('fs');
var net = require('net');
var ecstatic = require('ecstatic');

// HTTP
var app = http.createServer(
  ecstatic({ root: __dirname + '/public' })
).listen(8080);

console.log('HTTP Server listening on :8080');

var io = require('socket.io')(app);

// WebSocket
var clientCount = 0;

io.on('connection', function (socket) {
  socket.emit('connected', { status: 'OK' });
  clientCount += 1;
  console.log("Client count: " + clientCount);
  
  socket.on('server_index_online', function(data){
      console.log('Server Control Panel connected');
  });
  socket.on('startPlay', function(data) {
      console.log('Server starts play. Notifying clients.');
      socket.broadcast.emit('play');
  });
});

// TCP
var host = '0.0.0.0';
var port = 5000;

var server = net.createServer();
server.listen(port, host);

server.on('connection', function(socket) {
  console.log('TCP connected: ' + socket.remoteAddress +':'+ socket.remotePort);
  socket.on('data', function(data) {
      console.log('TCP Recevied: ' + data.toString().trim());
  });
}).listen(port, host);


