var highScore = 0;
var currentScore = 0;
var hero;
var enemies;
var gameLoop;
var playerId;
//socket io here
var socket = io.connect('//localhost:3000');

socket.on('welcome', function(data) {
  startNewGame(enemyPositions());
});

socket.on('playerId', function(data) {playerId = data.playerId;});
socket.on('error', function() { console.error(arguments); });
socket.on('message', function() { console.log(arguments); });

socket.on('collision', function(data) {
  if (highScore < data.currentScore) highScore = data.currentScore;
  currentScore = 0;
  updateHighScore();
  if(data.playerId === playerId) {
    displayMessage('You Messed Up');
  }
  else {
    displayMessage('Another Player Messed Up');
  }
});

setInterval(function(){updateScore(); }, 50);

var displayMessage = function(message) {
  var msg = d3.select('svg')
      .selectAll('.message')
      .data(message);

   msg.enter().append('text');

   msg.attr('x', 360)
      .attr('y', 220)
      .attr('fill', 'red')
      .attr('class', 'message')
      .text(message)
      .transition()
      .duration(2000)
      .delay(1000)
      .text('');
};

var updateScore = function() {
  currentScore++;
  d3.select('.currentScore').text(currentScore);
};

var updateHighScore = function() {
  d3.select('.highScore').text(highScore);
};

var updateEnemies = function(data) {
  enemies.data(data);

  enemies.transition()
      .duration(1000)
      .delay(400)
      .attr('cx', function(d) { return d.x; })
      .attr('cy', function(d) { return d.y; })
      .tween('custom', checkCollision);

  //       enemies.enter().append('rect')
  //     .attr('x', function(d){ return d.x; })
  //     .attr('y', function(d) { return d.y; })
  //     .attr('width', 20)
  //     .attr('height', 20)
  //     .transition()
  //     .attr('class', 'enemy');


  // enemies.transition()
  //     .duration(1000)
  //     .delay(400)
  //     .attr('x', function(d) { return d.x; })
  //     .attr('y', function(d) { return d.y; });
  //     .tween('custom', checkCollision);

};



var checkCollision = function() {
  return function() {
    var enemy = d3.select(this);
    var enemyX = enemy.attr('cx');
    var enemyY = enemy.attr('cy');

    heroX = hero.attr('cx');
    heroY = hero.attr('cy');

    if (Math.abs(heroX - enemyX) < 20 && Math.abs(heroY - enemyY) < 20) {
      socket.emit('collision', {playerId: playerId, currentScore: currentScore});
    }
  };
};

var enemyPositions = function() {
  var positions = [];
  for (var i=0; i<26; i++) {
    positions.push({'x': Math.floor(Math.random()*700 + 10),
                    'y': Math.floor(Math.random()*419 + 10) });
  }
  return positions;
};


var createHero = function(data) {
  hero = d3.select('svg')
      .selectAll('.hero')
      .data(data);

  hero.enter().append('circle')
      .attr('cx', 360)
      .attr('cy', 220)
      .attr('r', 10)
      .attr('fill', 'red')
      .attr('class', 'hero')
      .call(d3.behavior.drag().on("drag", move));
};

var move = function(){
    var dragTarget = d3.select(this);
    dragTarget
        .attr("cx", function(){return d3.event.dx + parseInt(dragTarget.attr("cx"))})
        .attr("cy", function(){return d3.event.dy + parseInt(dragTarget.attr("cy"))});
};

var startNewGame = function(data) {
  clearInterval(gameLoop);
  enemies = d3.select('svg')
      .selectAll('.enemy')
      .data({})
      .exit()
      .remove();

  enemies = d3.select('svg')
      .selectAll('.enemy')
      .data(data)
      .enter()
      .append('circle');

  enemies.attr('r', '0')
      .attr('cx', function(d){ return d.x; })
      .attr('cy', function(d) { return d.y; })
      .transition()
      .attr('r', '10')
      .attr('class', 'enemy');

  highScore = 0;
  updateHighScore();
  currentScore = 0;

  createHero([{}]);

  gameLoop = setInterval(function() {
    console.log('still looping');
    updateEnemies(enemyPositions());
  }, 1500);
};






