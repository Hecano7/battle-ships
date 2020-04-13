document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("counter").innerHTML = `To begin set your ships on the field.`;
  createBoard();
});

let playersTurn = "Player 1";
let totalPlayers = 2;
let playersGameBoards = [];
let individualsShotsFired = [];
let squareSize = 50;
let gameboardContainer = document.getElementById("gameboard");
let gameboard = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

let shipKinds = {
  destroyer: { length: 2, coordinates: [] },
  cruiser: { length: 3, coordinates: [] },
  submarine: { length: 3, coordinates: [] },
  battleship: { length: 4, coordinates: [] },
  carrier: { length: 5, coordinates: [] },
};

let allowShips = false;
let firstCoordinate = [];
let clickableCoordinates = [];
let shipSize = 0;
let clickDisplay = 0;
var counter = "0";

let Destroyer = true;
let Cruiser = true;
let Submarine = true;
let Battleship = true;
let Carrier = true;

gameboardContainer.addEventListener("click", clickHandlerBoard);

function numberOfPlayers() {
    enableButtons();
    document.getElementById("counter").innerHTML = "Select a button to set a ship.";
}

function clickHandlerBoard(e) {
  let row = Number(e.target.id[0]);
  let column = Number(e.target.id[2]);
  let currentClick = `${row},${column}`;

  if (playersGameBoards.length == totalPlayers) {
    initiateGame(row, column);
  }

  if (allowShips && gameboard[row - 1][column - 1] !== 1 && playersGameBoards.length < totalPlayers) {
    setShips(row, column, e, currentClick);
    if (playersGameBoards.length == totalPlayers) {
      document.getElementById("left-align").remove();
      counter = 1;
      showField();
      document.getElementById("counter").innerHTML = `Ready to play the game? Begin with Player 1 to take the first shot.`;
    }
  }
}

function placeShip(e) {
  console.log("placeShip");
  let row = Number(e.target.id[0]);
  let column = Number(e.target.id[2]);
  counter += 1;
  clickDisplay -= 1;
  gameboard[row - 1][column - 1] = 1;
  shipKinds.destroyer.coordinates.push(`${row},${column}`);
  if (e.target.className == "cell") {
    e.target.className = "ships cell";
  } else {
    e.target.className = "cell";
  }
}

function secondPossibleClick(row, column) {
  sides = [
    `${firstCoordinate[0][0]},${firstCoordinate[0][1] + 1}`,
    `${firstCoordinate[0][0]},${firstCoordinate[0][1] - 1}`,
    `${firstCoordinate[0][0] - 1},${firstCoordinate[0][1]}`,
    `${firstCoordinate[0][0] + 1},${firstCoordinate[0][1]}`,
  ];
  let east = [];
  let west = [];
  let north = [];
  let south = [];

  var min_column = column - shipSize;
  if (0 > min_column) {
    min_column = 0;
  }
  var min_row = row - shipSize;
  if (0 > min_row) {
    min_row = 0;
  }
  var right = gameboard[row - 1].slice(column, column + shipSize - 1);
  var left = gameboard[row - 1].slice(min_column, column - 1);
  var up = gameboard.slice(min_row, row - 1);
  let upTown = up.map((i) => i[column - 1]);
  var down = gameboard.slice(row, row - 1 + shipSize);
  let downTown = down.map((i) => i[column - 1]);
  for (var i = 0; i < right.length; i++) {
    if (right[i] == 0) {
      east.push(right[i]);
    } else {
      break;
    }
  }
  for (var i = left.length - 1; i >= 0; i--) {
    if (left[i] == 0) {
      west.push(left[i]);
    } else {
      break;
    }
  }
  for (var i = upTown.length - 1; i >= 0; i--) {
    if (upTown[i] == 0) {
      north.push(upTown[i]);
    } else {
      break;
    }
  }
  for (var i = 0; i < downTown.length; i++) {
    if (downTown[i] == 0) {
      south.push(downTown[i]);
    } else {
      break;
    }
  }
  if (north.length + south.length >= shipSize - 1) {
    clickableCoordinates.push(sides[2]);
    clickableCoordinates.push(sides[3]);
  }
  if (west.length + east.length >= shipSize - 1) {
    clickableCoordinates.push(sides[0]);
    clickableCoordinates.push(sides[1]);
  };
}

function doesShipFit(x, y) {
  let answer = [];
  var right = gameboard[x - 1].slice(y, y + shipSize - 1);
  if (right.length == shipSize - 1 && !right.includes(1)) {
    answer.push(1);
  }
  var min_y = y - shipSize;
  if (0 > min_y) {
    min_y = 0;
  }
  var min_x = x - shipSize;
  if (0 > min_x) {
    min_x = 0;
  }
  var left = gameboard[x - 1].slice(min_y, y - 1);
  if (left.length == shipSize - 1 && !left.includes(1)) {
    answer.push(1);
  }
  var up = gameboard.slice(min_x, x - 1);
  let upTown = up.map((i) => i[y - 1]);
  if (upTown.length == shipSize - 1 && !upTown.includes(1)) {
    answer.push(1);
  }
  var down = gameboard.slice(x, x - 1 + shipSize);
  let downTown = down.map((i) => i[y - 1]);
  if (downTown.length == shipSize - 1 && !downTown.includes(1)) {
    answer.push(1);
  }
  return answer.includes(1);
}

function nextClick(row, column) {
  if (firstCoordinate[0][0] < row) {
    console.log('down');
    clickableCoordinates.splice(0, 1);
    clickableCoordinates.splice(1, 2);
    clickableCoordinates.push(`${row + 1},${column}`);
    
    if (gameboard[row] == undefined) {
      clickableCoordinates.push(
        `${firstCoordinate[0][0] - 1},${firstCoordinate[0][1]}`
        );
      }
    }
    
    if (firstCoordinate[0][0] > row) {
      console.log('up');
      clickableCoordinates.splice(1, 3);
      clickableCoordinates.push(`${row - 1},${column}`);
      console.log("up"+clickableCoordinates);
      
      if (gameboard[row - 2] == undefined) {
        clickableCoordinates.push(
          `${firstCoordinate[0][0] + 1},${firstCoordinate[0][1]}`
          );
        }
      }
      
      if (firstCoordinate[0][1] > column) {
        console.log('left');
        clickableCoordinates.splice(0, 3);
        clickableCoordinates.push(`${row},${column - 1}`);
        console.log(clickableCoordinates);
        
        if (gameboard[column - 2] == undefined) {
       clickableCoordinates.push(
        `${firstCoordinate[0][0]},${firstCoordinate[0][1] + 1}`
      );
    }
  }

  if (firstCoordinate[0][1] < column) {
    console.log('right');
    clickableCoordinates.splice(0, 2);
    clickableCoordinates.splice(1, 1);
    clickableCoordinates.push(`${row},${column + 1}`);
    console.log(clickableCoordinates);

    if (gameboard[column + 1] == undefined) {
      clickableCoordinates.push(
        `${firstCoordinate[0][0]},${firstCoordinate[0][1] - 1}`
      );
    }
  }
}

function createBoard() {
  for (let rows = 1; rows < 9; rows++) {
    for (let columns = 1; columns < 9; columns++) {
      let square = document.createElement("div");
      square.id = `${rows},${columns}`;
      square.className = "cell";
      square.innerHTML = `${rows},${columns}`;
      gameboardContainer.appendChild(square);
    }
  }
}

function useNextButton() {
  firstCoordinate = [];
  clickableCoordinates = [];
  shipSize = 0;
  counter = "0";
  shipToggle();
  enableButtons();
  blinkingOff();
  document.getElementById("counter").innerHTML = "Select a button to set a ship.";
};

function setDestroyer() {
  disableButons();
  shipSize = 5;
  clickDisplay = 5;
  shipToggle();
  counter = 0;
  Destroyer = false;
  document.getElementById("counter").innerHTML = `Select ${clickDisplay} coordinates to set your ship.`;
}

function setCruiser() {
  disableButons();
  shipSize = 4;
  clickDisplay = 4;
  shipToggle();
  counter = 0;
  Cruiser = false;
  document.getElementById("counter").innerHTML = `Select ${clickDisplay} coordinates to set your ship.`;
}

function setSubmarine() {
  disableButons();
  shipSize = 3;
  clickDisplay = 3;
  shipToggle();
  counter = 0;
  Submarine = false;
  document.getElementById("counter").innerHTML = `Select ${clickDisplay} coordinates to set your ship.`;
}

function setBattleship() {
  disableButons();
  shipSize = 2;
  clickDisplay = 2;
  shipToggle();
  counter = 0;
  Battleship = false;
  document.getElementById("counter").innerHTML = `Select ${clickDisplay} coordinates to set your ship.`;
}

function setCarrier() {
  disableButons();
  shipSize = 1;
  clickDisplay = 1;
  shipToggle();
  counter = 0;
  Carrier = false;
  document.getElementById("counter").innerHTML = `Select ${clickDisplay} coordinates to set your ship.`;
}

function shipToggle() {
  allowShips = !allowShips;
}

function initiateGame(row, column) {
  console.log(counter);
  changeGridOpacity();
  gameboardContainer.removeEventListener("click", clickHandlerBoard);
  if (playersGameBoards[counter][row - 1][column - 1] == 1) {
    individualsShotsFired[counter][row - 1][column - 1] = 1;
    document.getElementById("gameboard").style.backgroundImage = "url('/img/hit.jpg')";
    document.getElementById("counter").innerHTML = `Hit!`;
  } else {
    individualsShotsFired[counter][row - 1][column - 1] = 2;
    document.getElementById("gameboard").style.backgroundImage = "url('/img/miss.jpg')";
    document.getElementById("counter").innerHTML = `Missed!`;
  }
  if (counter == totalPlayers - 1) {
    counter = -1;
  }
  counter++;
  setTimeout(showField, 3000);
}

function setShips(row, column, e, currentClick) {
  if (counter == 0 && doesShipFit(row, column)) {
    firstCoordinate.push([row, column]);
    secondPossibleClick(row, column);
    blinking();
    placeShip(e);
    document.getElementById("counter").innerHTML = `Select ${clickDisplay} coordinates to set your ship.`;
  }
  if (firstCoordinate.length == 1 && clickableCoordinates.includes(currentClick)) {
    if (counter > 0 && counter < shipSize) {
      nextClick(row, column)
    };
    console.log(clickableCoordinates);
    blinking();
    placeShip(e);
    document.getElementById("counter").innerHTML = `Select ${clickDisplay} coordinates to set your ship.`;
  }
  if (counter >= shipSize) {
    useNextButton();
    setPlayersGameBoards();
  }
}

function disableButons() {
  document.getElementById("Destroyer").disabled = true;
  document.getElementById("Cruiser").disabled = true;
  document.getElementById("Submarine").disabled = true;
  document.getElementById("Battleship").disabled = true;
  document.getElementById("Carrier").disabled = true;
  document.getElementById('Destroyer').className = "grayed";
  document.getElementById('Cruiser').className = "grayed";
  document.getElementById('Submarine').className = "grayed";
  document.getElementById('Battleship').className = "grayed";
  document.getElementById('Carrier').className = "grayed";
}

function enableButtons() {
  document.getElementById("counter").innerHTML = clickDisplay;
  if (Destroyer == true) {
    document.getElementById("Destroyer").disabled = false;
    document.getElementById('Destroyer').className = "button";
  }
  if (Cruiser == true) {
    document.getElementById("Cruiser").disabled = false;
    document.getElementById('Cruiser').className = "button";
  }
  if (Submarine == true) {
    document.getElementById("Submarine").disabled = false;
    document.getElementById('Submarine').className = "button";
  }
  if (Battleship == true) {
    document.getElementById("Battleship").disabled = false;
    document.getElementById('Battleship').className = "button";
  }
  if (Carrier == true) {
    document.getElementById("Carrier").disabled = false;
    document.getElementById('Carrier').className = "button";
  }
}

function delay(){
  console.log('hello');
  if (playersGameBoards.length < totalPlayers) {
      enableButtons();
  }
  earaseBoard();
  gameboardContainer.addEventListener("click", clickHandlerBoard);
  document.getElementById("counter").innerHTML = `Now it's Player ${playersGameBoards.length + 1}'s turn to set their ships.`;
  if (playersGameBoards.length == totalPlayers) {
    document.getElementById("counter").innerHTML = `Ready to play the game? Begin with Player 1 to take the first shot.`;
  }
}

function setPlayersGameBoards() {
  if (
    Destroyer == false &&
    Cruiser == false &&
    Submarine == false &&
    Battleship == false &&
    Carrier == false
  ) {
    playersGameBoards.push(gameboard);
    Destroyer = true;
    Cruiser = true;
    Submarine = true;
    Battleship = true;
    Carrier = true;
    gameboardContainer.removeEventListener("click", clickHandlerBoard);
    document.getElementById("counter").innerHTML = `Now it's Player ${playersGameBoards.length + 1}'s turn to set their ships.`;
    individualsShotsFired.push([
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    setTimeout(delay,3000)
  }
}

function earaseBoard() {
  gameboard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  for (let rows = 1; rows < 9; rows++) {
    for (let columns = 1; columns < 9; columns++) {
      document.getElementById(`${rows},${columns}`).className = "cell";
    }
  }
}

function showField() {
  revertGridOpacity();
  gameboardContainer.addEventListener("click", clickHandlerBoard);
  document.getElementById("gameboard").style.backgroundImage = "url(/img/ocean.jpg)";
  document.getElementById("counter").innerHTML = `Player ${parseInt(counter) + 1}'s Turn and their previous guesses.`;
  for (let rows = 1; rows < 9; rows++) {
    for (let columns = 1; columns < 9; columns++) {
      if (individualsShotsFired[counter][rows - 1][columns - 1] == 1) {
        document.getElementById(`${rows},${columns}`).className = "hit cell";
      }
      if (individualsShotsFired[counter][rows - 1][columns - 1] == 2) {
        document.getElementById(`${rows},${columns}`).className = "miss cell";
      }
      if (individualsShotsFired[counter][rows - 1][columns - 1] == 0) {
        document.getElementById(`${rows},${columns}`).className = "cell";
      }
    }
  }
}

function changeGridOpacity(){
  var cells = document.getElementsByClassName("cell");
  for(i = 0; i < cells.length; i++) {
    document.getElementsByClassName("cell")[i].style.opacity = "0.3";
  } 
}

function revertGridOpacity(){
  var cells = document.getElementsByClassName("cell");
  for(i = 0; i < cells.length; i++) {
    document.getElementsByClassName("cell")[i].style.opacity = "1";
  } 
}

function blinking(){
  blinkingOff();
  // clickableCoordinates => clickableCoordinates.map(obj => document.getElementById(obj).className = "nextClick");
  if(counter == 0 && clickableCoordinates.length>0){
    for(var i = 0; i < clickableCoordinates.length; i++){
      if(document.getElementById(clickableCoordinates[i]) && document.getElementById(clickableCoordinates[i]).className != "ships cell"){
       document.getElementById(clickableCoordinates[i]).className = "nextClick";
      }
    }
  }
  if(counter > 0){
    if(clickableCoordinates[1]){ 
      if(document.getElementById(clickableCoordinates[1]) != null){ 
        console.log("up");
      document.getElementById(clickableCoordinates[1]).className = "nextClick";
      }else{
        if(document.getElementById(clickableCoordinates[2]).className != "ships cell"){       
      document.getElementById(clickableCoordinates[2]).className = "nextClick";}
    } 
    }else{    
      console.log(clickableCoordinates); 
      document.getElementById(clickableCoordinates[0]).className = "nextClick";
    }
  }
}

function blinkingOff(){
  for (let rows = 1; rows < 9; rows++) {
    for (let columns = 1; columns < 9; columns++) {
      if(document.getElementById(`${rows},${columns}`).className == "nextClick"){
      document.getElementById(`${rows},${columns}`).className = "cell";
      }
    }
  }
}