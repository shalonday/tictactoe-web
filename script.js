/*
TOP TicTacToe project for practicing Factory Functions and the Module Pattern.
MVP scenario:
start game button displays a new board and fresh scores from 0, assign X and O
Player 1 goes first. // a message simulates a tosscoin and a message appears saying who goes first
Player 1 clicks a div on the display which corresponds to the cell to be marked.
Board is updated with their symbol.
Player 2 goes next and does the same thing.
Loop until someone wins or the board is full without a win.
Update scores and display a message.
*/

// Factory. Can be used more than once. Allows us to use closures which "privatizes" variables and
// functions despite JS not having a "private" keyword.
const playerFactory = (name, symbol) => {
  let _score = 0; // it is common in JS to prefix private properties with "_"
  const _name = name;
  const getScore = () => _score;
  const getName = () => _name;  
  const play = () => {
    console.log(`${name}'s turn`);
    GameController.setCurrentPlayer(name); // 'this' gets assigned to window, so use name instead.
    GameController.addOnClickToBoard(Gameboard.board, symbol);
  }

  const winARound = () => {
    _score++;
    return `${name} wins this round!`;
  }
  // closures: I can use closures for updating the score perhaps since closures have to do with 
  // private vars and functions. So play will be accessible outside and it updates score, 
  // but score itself won't be directly accessible outside.

  return {getScore, getName, play, winARound};
}

// Module for the Gameboard. Module pattern is similar to the factory, but 
// is for creating singleton objects. There are apparently many variations of doing modules,
// this one is the "Revealing Module Pattern" where we return the properties we want to be publicly
// available.
const Gameboard = (() => {
  'use strict'; // which does what?
  
  // bind this object to pre-made divs in index.html
  let board = document.getElementsByClassName('cell');

  return {board};
})();

// // methods for updating player scores, starting and ending games.
// const GameMaster = (() => {
//   let startGame
// })();

// the clue had a "Controller" module 
const GameController = (() => {
  'use strict'; // "good practice": https://coryrylan.com/blog/javascript-module-pattern-basics
  let currentPlayer = null; 

  const setCurrentPlayer = (playerName) => {
    if (playerName == player1.getName()){
      currentPlayer = player1;
    } else {
      currentPlayer = player2;
    }
  }

  const addOnClickToBoard = (board, symbol) => {
    const controller = new AbortController(); // to allow onClick event listener to be "abortable"
    for(var i = 0; i < board.length; i++) {
      var anchor = board[i];

      // add event listener only if cell.textContent is empty
      if (anchor.textContent == ""){
        anchor.addEventListener('click', (e) => {
          addSymbol(e.target, symbol, controller); // used an enclosed (private) function here. YAS.
          checkWinState(currentPlayer);
          changePlayer(currentPlayer);          
        }, { signal: controller.signal });
      }
    }
  } 

  const addSymbol = (cell, symbol, controller) => {
    if (cell.textContent == ""){
      cell.textContent = symbol;
      controller.abort(); // abort the controller object associated with the listener that calls addSymbol
                          // ie, remove the current event listener from all cells.
                          // prevents eventlisteners from piling up on the cells.
    }
  }

  const changePlayer = (currentPlayer) => {
    if (currentPlayer == player1){
      player2.play();
    } else if (currentPlayer == player2) {
      player1.play();
    }
  }

  const checkWinState = (player) => {
    const b = Gameboard.board;
    // check board contents in if else blocks, with a "main" cell in each block which will be the
    // only one we will check for != null, for simplicity purposes.
    if (b[0].textContent != ""){ // [0] is the "main" here.
      console.log("entered branch [0] shallow");
      if ((b[0].textContent == b[1].textContent && b[1].textContent == b[2].textContent) ||
          (b[0].textContent == b[4].textContent && b[4].textContent == b[8].textContent) ||
          (b[0].textContent == b[3].textContent && b[3].textContent == b[6].textContent)){
            // end round and display winner
            console.log("entered branch [0] deep");
            console.log(player.winARound());
            clearBoard();
      }
    } 
    
    if (b[3].textContent != ""){ // [3] is the main one for this branch
      console.log("entered branch [3] shallow");
      if (b[3].textContent == b[4].textContent && b[4].textContent == b[5].textContent){
        console.log("entered branch [3] deep");
        console.log(player.winARound());
        clearBoard();
      }
    }

    if (b[6].textContent != ""){ // [6] is the "main" here.
      if ((b[2].textContent == b[4].textContent && b[4].textContent == b[6].textContent) ||
          (b[6].textContent == b[7].textContent && b[7].textContent == b[8].textContent)){
        console.log(player.winARound());
        clearBoard();
      }
    } 

    if (b[1].textContent != ""){ 
      if (b[1].textContent == b[4].textContent && b[4].textContent == b[7].textContent){
        console.log(player.winARound());
        clearBoard();
      }
    }

    if (b[2].textContent != ""){ 
      if (b[2].textContent == b[5].textContent && b[5].textContent == b[8].textContent){
        console.log(player.winARound());
        clearBoard();
      }
    }

    // check if there are no more boxes left to fill
    for(var i = 0; i < b.length; i++) {
      if (b[i].textContent == ""){
        break;
      }
      if (i == 8){
        // end game and display tie message
        console.log("It's a tie!");
        clearBoard();
      }
    }
  }

  const clearBoard = () => {
    const b = Gameboard.board;
    for(var i = 0; i < b.length; i++) {
      b[i].textContent = "";
    }
  }
  
  return {addOnClickToBoard, setCurrentPlayer};
})();

const player1 = playerFactory('Pio', 'O');
const player2 = playerFactory('James', 'X');
player1.play();// overwrite the previous onClick, changing the symbol added.
