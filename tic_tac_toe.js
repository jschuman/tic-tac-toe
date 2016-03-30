;(function() {
  var Game = function(canvasId){
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.init();

    this.canvas.addEventListener("click", self.gameOnClick, false);
  };

  Game.prototype = {

    init: function(){
       this.drawBoard();

      //each inner array is a column
      this.board = [[null, null, null], [null, null, null], [null, null, null]];

      // who's turn is it?
      this.turn = 'X';
      this.gameOver = false;

    },
    
    drawBoard: function(){
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.context.beginPath();
      this.context.lineWidth = 6;
      this.context.moveTo(100,10);
      this.context.lineTo(100,300);

      this.context.moveTo(200,10);
      this.context.lineTo(200,300);

      this.context.moveTo(10,100);
      this.context.lineTo(300,100);

      this.context.moveTo(10,200);
      this.context.lineTo(300,200);

      this.context.stroke();
    },

    winningPlayer: function(){
      //check rows and columns
      for (i=0; i<3; i++){
        if (this.board[i][0] && this.board[i][0]===this.board[i][1] && this.board[i][1]===this.board[i][2]){            
          return this.board[i][0];
        }
        if (this.board[0][i] && this.board[0][i]===this.board[1][i] && this.board[1][i]===this.board[2][i]){
          return this.board[0][i];
        }
      }

      //check diagonals
      if (this.board[0][0] && this.board[0][0]===this.board[1][1] && this.board[1][1]===this.board[2][2]){            
        return this.board[0][0];
      }

      if (this.board[0][2] && this.board[0][2]===this.board[1][1] && this.board[1][1]===this.board[2][0]){            
        return this.board[0][2];
      }

      return null;
    },

    tieGame: function(){
      var spaceLeft = false;
      for (i=0; i<3; i++){
        for (j=0; j<3; j++){
          if (this.board[i][j] == null){
            spaceLeft = true;
            break;
          }
        }
      }

      return !spaceLeft;
    },

    nextPlayerTurn: function(){
      this.turn = (this.turn == 'X' ? 'O' : 'X');

      //update the page
      var turnSpan = document.getElementById('playerTurn');
      turnSpan.innerHTML = this.turn;
    },

    addToken: function(gridX, gridY){
      //check if token already exists?
      if (this.gameOver || this.board[gridX][gridY]){
        return;
      }

      //can add to board
      this.board[gridX][gridY] = this.turn;

      //draw it
      this.drawToken(gridX, gridY, this.turn);

      //check if winner
      var winner = this.winningPlayer();
      if (winner){
        this.gameOver = true;
        alert(winner + ' is the BIG Winner!');
        return;
      } else if (this.tieGame()){
        this.gameOver = true;
        alert("It's a Tie!");
        return;
      }

      //it's the next player's turn
      this.nextPlayerTurn();
    },

    drawToken: function(gridX, gridY, player){
      //draw on board
      this.context.lineWidth = 2;
      this.context.beginPath();
      
      if (player === 'X'){
        // X, get the dimensions and draw it
        var leftX = 20 + gridX * 100;
        var rightX = 85 + gridX * 100;
        var topY = 20 + gridY * 100;
        var bottomY = 85 + gridY * 100;
      
        this.context.moveTo(leftX, topY);
        this.context.lineTo(rightX, bottomY);
        this.context.moveTo(rightX, topY);
        this.context.lineTo(leftX, bottomY);

      } else if (player ==='O'){
        //circle, get the center and radius and draw it
        radius = 35;
        var x = 50 + gridX*100;
        var y = 50 + gridY*100;
        this.context.arc(x, y, radius, 0, Math.PI * 2, false);
      }

      this.context.closePath();
      this.context.stroke();
    }

  };

  gameOnClick = function(e) {
    var cell = getCursorPosition(this, e);

    if (cell.gridX >= 0 && cell.gridY >= 0){
      game.addToken(cell.gridX, cell.gridY);
    }
  };

  getCursorPosition = function(canvas, e) {
      var x;
      var y;
      if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
      } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      x -= canvas.offsetLeft;
      y -= canvas.offsetTop;

      var gridX = -1;
      var gridY = -1;

      //brute force for now:
      if (x>10 && x<110){
        gridX = 0;
      } else if (x>110 && x<210){
        gridX = 1;
      } else if (x>210 && x<310){
        gridX = 2;
      }

      if (y>10 && y<110){
        gridY = 0;
      } else if (y>110 && y<210){
        gridY = 1;
      } else if (y>210 && y<310){
        gridY = 2;
      }
      
      return {gridX: gridX, gridY: gridY};
    },


  window.onload = function() {
    game = new Game('screen');

    document.getElementById('clear').addEventListener('click', function() {
        game.init();
    }, false);

  };
})();
