const gamesMap = require('../common/gamesMap');
const gamesMapClient = require('../common/gamesMapClient');

const doAction = ({i, j}, gameId, userId) => {

  let arr = [];
  let table = JSON.parse(JSON.stringify(gamesMap[gameId]));
  let tableClient = JSON.parse(JSON.stringify(gamesMapClient[gameId]));
  if (table[i][j].isMine) {

    // gamesMap[gameId] = dataTable;

    table[i][j].isOpen = true;
    table[i][j].isBlownUp = true;
    table[i][j].userId = userId;

    tableClient[i][j].isOpen = true;
    tableClient[i][j].isBlownUp = true;
    tableClient[i][j].userId = userId;
    tableClient[i][j].isMine = true;


    gamesMap[gameId] = table;

    gamesMapClient[gameId] = tableClient;

    return table[i][j].isMine;
  }
  if (table[i][j].amountOfMines !== 0) {
    table[i][j].isOpen = true;
    table[i][j].userId = userId;

    tableClient[i][j].isOpen = true;
    tableClient[i][j].userId = userId;

    gamesMap[gameId] = table;

    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[i].length; j++) {
        if(table[i][j].isOpen) {
          tableClient[i][j].amountOfMines = table[i][j].amountOfMines
        }
      }
    }

    gamesMapClient[gameId] = tableClient;

    return;
  }
  arr.push(table[i][j])
  console.time('qqq')
  while (arr.length > 0) {

    let element = arr.shift();

    table[element.i][element.j].isOpen = true;
    tableClient[element.i][element.j].isOpen = true;
    if (!table[element.i][element.j].userId) {
      table[element.i][element.j].userId = userId;
      tableClient[element.i][element.j].userId = userId;
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (table[element.i - 1 + i] && table[element.i - 1 + i][element.j - 1 + j]) {
          if (table[element.i - 1 + i][element.j - 1 + j].amountOfMines === 0 && table[element.i - 1 + i][element.j - 1 + j].isOpen === false) {
            arr.push(table[element.i - 1 + i][element.j - 1 + j])
          }
          table[element.i - 1 + i][element.j - 1 + j].isOpen = true;
          tableClient[element.i - 1 + i][element.j - 1 + j].isOpen = true;
          if (!table[element.i - 1 + i][element.j - 1 + j].userId) {
            table[element.i - 1 + i][element.j - 1 + j].userId = userId;
            tableClient[element.i - 1 + i][element.j - 1 + j].userId = userId;
          }
        }
      }
    }
  }
  console.timeEnd('qqq')
  gamesMap[gameId] = table;

  for (let i = 0; i < table.length; i++) {
    for (let j = 0; j < table[i].length; j++) {
      if(table[i][j].isOpen) {
        tableClient[i][j].amountOfMines = table[i][j].amountOfMines
      }
    }
  }


  gamesMapClient[gameId] = tableClient;

}

module.exports = doAction;