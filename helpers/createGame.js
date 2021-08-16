const createMines = require('./createMines');
const gamesMapClient = require('../common/gamesMapClient');
const gamesMapClientInitial = require('../common/gamesMapClientInitial');

const createGame = (gameInfo, gameId) => {
  let firstPoint = 1;
  let sizeOfField = gameInfo.fieldSize.split('x');
  let coordinatesForMines = createMines(gameInfo.minesAmount, +sizeOfField[1], +sizeOfField[0]);

  let lastPoint = +sizeOfField[0];
  let table = [];
  let tableClient = [];
  let tableClientInitial = [];
  for (let i = 1; i <= sizeOfField[1]; i++) {
    let data = [];
    let dataClient = [];
    let dataClientInitial = [];
    for (let j = firstPoint; j <= lastPoint; j++) {
      data.push({isMine: false, isOpen: false, isChecked: false})
      dataClient.push({isOpen: false, isChecked: false})
      dataClientInitial.push({isOpen: false, isChecked: false})
    }
    firstPoint += +sizeOfField[0]
    lastPoint += +sizeOfField[0]
    table.push(data)
    tableClient.push(dataClient)
    tableClientInitial.push(dataClientInitial)
  }



  coordinatesForMines.forEach(item => {
    table[item.firstCoordinate][item.lastCoordinate].isMine = true;
  })

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      table[i][j].i = i;
      table[i][j].j = j;
      tableClient[i][j].i = i;
      tableClient[i][j].j = j;
      tableClientInitial[i][j].i = i;
      tableClientInitial[i][j].j = j;
      let amountMines = 0;
      if (!table[i][j].isMine) {
        (table[i][j - 1] && table[i][j - 1].isMine) ? amountMines += 1 : amountMines += 0;
        (table[i][j + 1] && table[i][j + 1].isMine) ? amountMines += 1 : amountMines += 0;
        (table[i - 1] && table[i - 1][j].isMine) ? amountMines += 1 : amountMines += 0;
        (table[i + 1] && table[i + 1][j].isMine) ? amountMines += 1 : amountMines += 0;
        (table[i + 1] && table[i + 1][j - 1] && table[i + 1][j - 1].isMine) ? amountMines += 1 : amountMines += 0;
        (table[i + 1] && table[i + 1][j + 1] && table[i + 1][j + 1].isMine) ? amountMines += 1 : amountMines += 0;
        (table[i - 1] && table[i - 1][j + 1] && table[i - 1][j + 1].isMine) ? amountMines += 1 : amountMines += 0;
        (table[i - 1] && table[i - 1][j - 1] && table[i - 1][j - 1].isMine) ? amountMines += 1 : amountMines += 0;
      }
      table[i][j].amountOfMines = amountMines;
    }
  }
  gamesMapClient[gameId] = tableClient;
  gamesMapClientInitial[gameId] = tableClientInitial;
  return table;
};

module.exports = createGame;