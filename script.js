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
  const getScore = () => _score;  
  const play = () => {
    console.log(`${name}'s turn`);
    DisplayController.addOnClickToBoard(Gameboard.board, symbol);
  }
  // closures: I can use closures for updating the score perhaps since closures have to do with 
  // private vars and functions. So play will be accessible outside and it updates score, 
  // but score itself won't be directly accessible outside.

  return {getScore, play};
}

// Module for the Gameboard. Module pattern is similar to the factory, but 
// is for creating singleton objects. There are apparently many variations of doing modules,
// this one is the "Revealing Module Pattern" where we return the properties we want to be publicly
// available.
const Gameboard = (() => {
  'use strict'; // which does what?

  // either I create the array of 9 divs here or I bind this object to pre
  // -made divs in index.html if that's possible?
  let board = document.getElementsByClassName('cell');
                        
  const displayBoard = () => {
    // display the board on the screen... how tho? probs some css magick.
  }

  return {board};
})();

// // methods for updating player scores, starting and ending games.
// const GameMaster = (() => {
//   let startGame
// })();

// the clue had a "DisplayController" module 
const DisplayController = (() => {
  'use strict'; // "good practice": https://coryrylan.com/blog/javascript-module-pattern-basics

  const addOnClickToBoard = (board, symbol) => {
    const controller = new AbortController(); // to allow onClick event listener to be "abortable"
    for(var i = 0; i < board.length; i++) {
      var anchor = board[i];

      // add event listener only if cell.textContent is empty
      if (anchor.textContent == ""){
        anchor.addEventListener('click', (e) => {
          addSymbol(e.target, symbol, controller); // used an enclosed (private) function here. YAS.
          changePlayer(symbol);
          checkWinState();
        }, { signal: controller.signal });
      }
    }
  } // at its current state, the event listeners pile up. change such that every addonclick removes
    // the previous onClick listener.

  const addSymbol = (cell, symbol, controller) => {
    if (cell.textContent == ""){
      cell.textContent = symbol;
      controller.abort(); // abort the controller object associated with the listener that calls addSymbol
                          // ie, remove the current event listener from all cells.
                          // prevents eventlisteners from piling up on the cells.
    }
  }

  const changePlayer = (symbol) => {
    if (symbol == "O"){
      player2.play();
    } else if (symbol == "X") {
      player1.play();
    }
  }

  const checkWinState = () => {
    const b = Gameboard.board;
    // check board contents in if else blocks, with a "main" cell in each block which will be the
    // only one we will check for != null, for simplicity purposes.
    if (b[0].textContent != null){ // [0] is the "main" here.
      if ((b[0] == b[1] && b[1] == b[2]) ||
          (b[0] == b[4] && b[4] == b[8]) ||
          (b[0] == b[3] && b[3] == b[6])){
            // end game and display winner
          }
    } 
    
    if (b[3].textContent != null){ // [3] is the main one for this branch
      if (b[3] == b[4] && b[4] == b[5]){
            // end game and display winner
          }
    }

    if (b[6].textContent != null){ // [6] is the "main" here.
      if ((b[2] == b[4] && b[4] == b[6]) ||
          (b[6] == b[7] && b[7] == b[8])){
            // end game and display winner
          }
    } 

    if (b[1].textContent != null){ 
      if (b[1] == b[4] && b[4] == b[7]){
            // end game and display winner
          }
    }

    if (b[2].textContent != null){ 
      if (b[2] == b[5] && b[5] == b[8]){
            // end game and display winner
          }
    }

    // check if there are no more boxes left to fill
    for(var i = 0; i < b.length; i++) {
      if (b[i].textContent == ""){
        break;
      }
      if (i == 8){
        // end game and display tie message
      }
    }
  }

  
  return {addOnClickToBoard};
})();

const player1 = playerFactory('Pio', 'O');
const player2 = playerFactory('James', 'X');
player1.play();// overwrite the previous onClick, changing the symbol added.
