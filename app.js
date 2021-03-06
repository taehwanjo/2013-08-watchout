var http = require('http'),
    fs = require('fs'),
    url = require('url');

var players = 1;

// Send index.html to all requests
var app = http.createServer(function(req, res) {
  var path = url.parse(req.url, true).path;
  if (path === '/') {
    path = '/index.html';
  }
  var file = fs.readFileSync(__dirname + path);
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(file);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
    io.sockets.emit('welcome', { message: 'Welcome!' });
    socket.emit('playerId', {playerId: players++});
    socket.on('collision', function(data) {
      io.sockets.emit('collision', {playerId: data.playerId, currentScore: data.currentScore});
    });
});

app.listen(3000);