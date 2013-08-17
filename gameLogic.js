var highScore = 0;
var currentScore = 0;
var hero;

setInterval(function(){updateScore();}, 50);

var updateScore = function() {
  currentScore++;
  var score = d3.select('.currentScore')
      .selectAll('text')
      .data(currentScore.toString());

      score.enter().append('text')
      .text(function(d){return d;});

      score.transition().text(function(d){return d;});
};

var updateHighScore = function() {
  var highscore = d3.select('.highScore')
      .selectAll('text')
      .data(highScore.toString());

      highscore.enter().append('text')
      .text(function(d){return d;});

      highscore.transition().text(function(d){return d;});
};

var updateEnemies = function(data) {
  var enemies = d3.select('svg')
      .selectAll('.enemy')
      .data(data);

  enemies.enter().append('circle')
      .attr('r', '0')
      .attr('cx', function(d){ return d.x; })
      .attr('cy', function(d) { return d.y; })
      .transition()
      .attr('r', '10')
      .attr('class', 'enemy');

  enemies.transition()
      .duration(1000)
      .delay(400)
      .attr('cx', function(d){ return d.x; })
      .attr('cy', function(d) { return d.y; })
      .tween('custom', checkCollision);
};

var checkCollision = function() {
  var enemy = d3.select(this);
  var enemyX = enemy.attr('cx');
  var enemyY = enemy.attr('cy');

  heroX = hero.attr('cx');
  heroY = hero.attr('cy');

  if (Math.abs(heroX - enemyX) < 20 && Math.abs(heroY - enemyY) < 20) {
    if (highScore < currentScore) highScore = currentScore;
    currentScore = 0;
    updateHighScore();
  }

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
  console.log(data);
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
  hero = d3.select('.hero');

var move = function(){
    var dragTarget = d3.select(this);
    dragTarget
        .attr("cx", function(){return d3.event.dx + parseInt(dragTarget.attr("cx"))})
        .attr("cy", function(){return d3.event.dy + parseInt(dragTarget.attr("cy"))});
};

createHero([{}]);

console.log(hero);

updateEnemies(enemyPositions());
setInterval(function() {
  updateEnemies(enemyPositions());
}, 1500);




