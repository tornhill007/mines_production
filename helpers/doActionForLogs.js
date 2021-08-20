const gamesMap = require('../common/gamesMap');
const gamesMapClientInitial = require('../common/gamesMapClientInitial');
const gamesMapClientHistory = require('../common/gamesMapClientHistory');
// const gamesMapClient = require('../common/gamesMapClient');

const setAmountOfMinesHistory = (firstTable, initialTable) => {
  for (let i = 0; i < firstTable.length; i++) {
    for (let j = 0; j < firstTable[i].length; j++) {
      if(firstTable[i][j].isOpen) {
        initialTable[i][j].amountOfMines = firstTable[i][j].amountOfMines
      }
    }
  }
}


const doActionForLogs = ({i, j}, game, userId, gameId) => {
  // let gameTmp = JSON.parse(JSON.stringify(game));
  if (i == undefined || j == undefined) {
    return false;
  }
  let arr = [];
  let table = JSON.parse(JSON.stringify(game));
  let tableTmp = JSON.parse(JSON.stringify(gamesMap[gameId]));
  // let tableClientInitial = JSON.parse(JSON.stringify(gamesMapClientInitial[gameId]));
  if (table[i][j].isMine) {
    table[i][j].isOpen = true;
    table[i][j].isBlownUp = true;
    table[i][j].userId = userId;

    gamesMapClientHistory[gameId][i][j].isOpen = true;
    gamesMapClientHistory[gameId][i][j].isBlownUp = true;
    gamesMapClientHistory[gameId][i][j].isMine = true;
    gamesMapClientHistory[gameId][i][j].userId = userId;

    setAmountOfMinesHistory(gamesMap[gameId], gamesMapClientHistory[gameId])

    game = table;
    // gamesMapClientInitial[gameId] = tableClientInitial
    return game;
  }
  if (table[i][j].amountOfMines !== 0) {
    if(!table[i][j].isOpen && !table[i][j].userId) {
      table[i][j].userId = userId;
      gamesMapClientHistory[gameId][i][j].userId = userId;
    }
    table[i][j].isOpen = true;
    gamesMapClientHistory[gameId][i][j].isOpen = true;

    // gamesMapClientInitial[gameId] = tableClientInitial;

    setAmountOfMinesHistory(gamesMap[gameId], gamesMapClientHistory[gameId])

    game = table;
    return game;
  }
  arr.push(table[i][j])
  console.time('qqq')
  while (arr.length > 0) {

    let element = arr.shift();
    if (!table[element.i][element.j].userId && !table[element.i][element.j].isOpen) {
      gamesMapClientHistory[gameId][element.i][element.j].userId = userId;
      table[element.i][element.j].userId = userId;
    }
    gamesMapClientHistory[gameId][element.i][element.j].isOpen = true;
    table[element.i][element.j].isOpen = true;


    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (table[element.i - 1 + i] && table[element.i - 1 + i][element.j - 1 + j]) {
          if (table[element.i - 1 + i][element.j - 1 + j].amountOfMines === 0 && table[element.i - 1 + i][element.j - 1 + j].isOpen === false) {
            arr.push(table[element.i - 1 + i][element.j - 1 + j])
          }
          if (!table[element.i - 1 + i][element.j - 1 + j].userId && !table[element.i - 1 + i][element.j - 1 + j].isOpen) {
            table[element.i - 1 + i][element.j - 1 + j].userId = userId;
            gamesMapClientHistory[gameId][element.i - 1 + i][element.j - 1 + j].userId = userId;
          }
          gamesMapClientHistory[gameId][element.i - 1 + i][element.j - 1 + j].isOpen = true;
          table[element.i - 1 + i][element.j - 1 + j].isOpen = true;

        }
      }
    }
  }

  setAmountOfMinesHistory(gamesMap[gameId], gamesMapClientHistory[gameId])

  console.timeEnd('qqq')
  // gamesMapClientInitial[gameId] = tableClientInitial;
  game = table;
  return game;
}

module.exports = doActionForLogs;