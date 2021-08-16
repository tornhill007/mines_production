const gamesMapByTabs = require('../common/gamesMapByTabs');
const Games = require('../models/Games');

const setFlag = async (socket, gameid, {i, j}) => {
  gamesMapByTabs[gameid][socket.handshake.query.tabId][i][j].isFlag = true;
  return gamesMapByTabs[gameid]
}

module.exports = setFlag;