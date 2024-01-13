// start again

function GameBoard() {
  const rows = 3;
  const cols = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;
  const clearBoard = () => {
    console.log("clearing board");
    initializeBoard();
  };

  const printBoard = () => {
    board.map(row => {
      const res = row.map(cell => cell.getValue());

      return res;
    });
  };

  const placeIcon = (i, j, playersIcon) => {
    const value = board[i][j];
    //invalid
    if (value.getValue() === "X" || value.getValue() === "O") {
      return;
    }

    value.setValue(playersIcon);

    board[i][j] = value;

    return;
  };

  const initializeBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < cols; j++) {
        board[i].push(Cell());
      }
    }
  };
  initializeBoard();

  return { getBoard, placeIcon, printBoard, clearBoard };
}

function Cell() {
  let value = "";

  const setValue = playersIcon => {
    value = playersIcon;
  };

  const getValue = () => value;

  return { setValue, getValue };
}

//a board function will maintain the boards current state
//create the board by 2d array
//function to get the board
//function to add a cell to the board checking if valid if so place the user's icon

//cell will be a single cell representing a value inside of the grid
//the cell will have a value and functions to set and get the current value
//cell will default to an empty string

//game controller
//will handle changes to the game, set the players, and switch players get the currrent player
//also will handle playing a round of the game
//passing in the row and column the user' has selected to place their icon
//method will call the board function of setting the item into the board
//method to check if a winner is found

function GameController(playerOne = "Player One", playerTwo = "Player Two") {
  const board = GameBoard();
  const players = [
    { name: playerOne, icon: "X" },
    { name: playerTwo, icon: "O" },
  ];

  let activePlayer = players[0];

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const printUpdatedRound = () => {
    board.printBoard();

    // console.log(`${activePlayer.name}'s turn`);
  };

  const checkForTie = () => {
    const curBoard = board.getBoard();
    // console.log(board.printBoard());

    for (let i = 0; i < curBoard.length; i++) {
      for (let j = 0; j < curBoard[i].length; j++) {
        if (curBoard[i][j].getValue() === "") {
          return false;
        }
      }
    }
    return true;
  };

  const checkForWinner = () => {
    // const curPlayer = player;
    const columns = [];

    const curBoard = board.getBoard();

    let res = null;

    for (let rows of curBoard) {
      res = rows.every(cell => cell.getValue() === rows[0].getValue() && rows[0].getValue() !== "");
      if (res) {
        // console.log("res is true!!!!!");
        return res;
      }
    }

    //get all columns
    for (let i = 0; i < curBoard.length; i++) {
      const cols = [];
      for (let j = 0; j < curBoard[i].length; j++) {
        cols.push(curBoard[j][i]);
      }
      columns.push(cols);
    }

    for (let cols of columns) {
      res = cols.every(cell => cell.getValue() === cols[0].getValue() && cols[0].getValue() !== "");
      if (res) {
        // console.log("res is true in columns!!!!!");
        return res;
      }
    }

    //get all diagonials
    const diagonals = [
      [curBoard[0][0], curBoard[1][1], curBoard[2][2]],
      [curBoard[0][2], curBoard[1][1], curBoard[2][0]],
    ];

    for (let digonal of diagonals) {
      res = digonal.every(cell => cell.getValue() === digonal[0].getValue() && digonal[0].getValue() !== "");
      if (res) {
        // console.log("res is true from digonals!!!!!");
        return res;
      }
    }
  };
  const playRound = (x, y) => {
    // console.log(`Current player will play ${activePlayer.name} their icon is ${activePlayer.icon}`);

    board.placeIcon(x, y, activePlayer.icon);

    // check if winner occured

    if (checkForWinner()) {
      // console.log(`Current player won!  ${activePlayer.name} their icon is ${activePlayer.icon}`);
      // console.log("winner was found!!!");
      // printUpdatedRound();

      return `${activePlayer.name} has won!`;
    }
    const tie = checkForTie();
    console.log("tie", tie);
    if (checkForTie()) {
      // console.log(`Tie has occured no winner!!!!`);
      return `Tie has occured no winner!!!!`;
    }
    //player who just went is the winner.
    // reutn that player has they have won
    switchActivePlayer();
    printUpdatedRound();
  };

  return {
    switchActivePlayer,
    getActivePlayer,
    playRound,
    printUpdatedRound,
    getBoard: board.getBoard,
    resetBoard: board.clearBoard,
  };
}

//create screne controller funciton

// will render the current board into the dom
// will get references to points on the dom
// board div and player div
//player div  displays the current player's turn their icon
//board will render the entire baord
// will add css to at the grid
//inside of the board
// I'll render each item and add them to the dom using a for displaying the cells value into the grid item

function ScreenController() {
  const game = GameController();
  let gameisOver = false;
  const boardDiv = document.getElementById("board");
  const playerDiv = document.getElementById("player");
  const resetBtn = document.getElementById("reset");
  const modal = document.getElementById("modal");
  const modalHeader = document.getElementById("modal-header");
  console.log(playerDiv);
  const updateDom = () => {
    if (gameisOver) {
      return;
    }
    // console.log(game);
    const board = game.getBoard();
    boardDiv.innerHTML = "";

    let str = "";
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        str += `

           <button class="btn" data-btn-id=${j} data-btn-grid=${[i, j]}> ${cell.getValue()}  </button>
        
      `;
      });
    });
    boardDiv.innerHTML = str;
    playerDiv.innerHTML = `${game.getActivePlayer().name}'s turn`;
  };

  // have a start scren to select who gets x and who gets o
  function handleReset() {
    gameisOver = false;
    game.resetBoard();
    modal.style.display = "none";
    modalHeader.textContent = "";

    // game.switchActivePlayer();
    // game.printUpdatedRound();
    updateDom();
  }
  function clickHandlerBoard(e) {
    const data = e.target.dataset;
    if (!data.btnId) {
      return;
    }
    const [x, y] = data.btnGrid.split(",");
    const res = game.playRound(x, y);
    console.log("res", res);
    updateDom();
    if (res) {
      playerDiv.innerHTML = res;
      gameisOver = true;
      modal.style.display = "flex";
      modalHeader.textContent = res;

      return;
    }
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
  resetBtn.addEventListener("click", handleReset);
  updateDom();
}

//compl;ete dispaly the data to the board an add and add a click to trigger changing the icon

ScreenController();
// const game = GameController();

//x in columns
// game.playRound(0, 0);
// game.playRound(0, 1);
// game.playRound(1, 0);
// game.playRound(0, 2);
// game.playRound(2, 0);

//x in rows
// game.playRound(0, 0);
// game.playRound(1, 0);
// game.playRound(0, 1);
// game.playRound(2, 0);
// game.playRound(0, 2);

//x in diagonals
// top left to bottom right
// game.playRound(0, 0);
// game.playRound(1, 0);
// game.playRound(1, 1);
// game.playRound(2, 0);
// game.playRound(2, 2);

//x in diagonals
//top right to bottom left
// game.playRound(0, 2);
// game.playRound(1, 0);
// game.playRound(1, 1);
// game.playRound(0, 0);
// game.playRound(2, 0);

//tie game
// game.playRound(1, 1);
// game.playRound(0, 0);
// game.playRound(0, 2);
// game.playRound(2, 0);
// game.playRound(0, 1);
// game.playRound(2, 1);
// game.playRound(2, 2);
// game.playRound(1, 2);
// game.playRound(1, 0);
// game.playRound(2, 0);

// game.playRound(0, 1);
// game.playRound(0, 2);
// game.playRound(1, 0);
// game.playRound(1, 1);
// game.playRound(1, 2);
// game.playRound(2, 1);
// game.playRound(2, 0);
// game.playRound(2, 2);

// game.playRound(0, 1);
// game.playRound(2, 0);
// game.playRound(0, 2);
