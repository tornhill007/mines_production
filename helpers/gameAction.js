const Games = require('../models/Games');
const Tabs = require('../models/Tabs');
const Users = require('../models/Users');
const History = require('../models/History');
const Viewers = require('../models/Viewers');
const Moves = require('../models/Moves');
const UserInfo = require('../models/UserInfo');
const usersStateMap = require('../common/usersStateMap');
const socketsMap = require('../common/socketsMap');
const gamesMap = require('../common/gamesMap');
const gamesMapClient = require('../common/gamesMapClient');
const changeMove = require('../helpers/changeMove');

const gameAction = async (socket, isMine) => {

  let gameId = await Games.findOne({
    include: [{
      model: Tabs,
      required: true,
      where: {
        tabid: socket.handshake.query.tabId
      }
    }],
  })

  let game = await Games.findOne({
    where: {
      gameid: gameId.gameid
    }
  })

  let gameOwner = await Users.findOne({
    where: {
      userid: game.owner
    }
  })

  if (isMine) {
    let allTabs = await Users.findOne({
      include: [{
        model: Tabs,
        required: true,
        where: {
          userid: socket.user.userid
        }
      }]
    })

    allTabs.tabs.forEach(tab => {
      if (usersStateMap[gameId.gameid][tab.tabid]) {
        delete usersStateMap[gameId.gameid][tab.tabid]
      }
    })

    let tabsGames = await Tabs.findAll({
      where: {
        userid: socket.user.userid
      }
    })

    let tabsGamesArr = tabsGames.map(item => item.tabid);

    let tabsInGame = await Tabs.findAll({
      where: {
        tabid: tabsGamesArr,
        gameid: gameId.gameid
      }
    })

    let tabsArr = tabsInGame.map(item => {
      return item.tabid
    })


    if (tabsArr.length === 1) {
      await Moves.destroy({
        where: {
          gameid: gameId.gameid
        }
      })
      game.isfinished = true;
    }

    tabsArr.forEach(item => {
      game.createViewer({tabid: item})
      socketsMap[item].emit("game/surrendered", {surrendered: true});
    })
    // socket.emit("game/surrendered", {surrendered: true});
    let arr = Object.keys(usersStateMap[gameId.gameid])
    for (let i = 0; i < arr.length; i++) {
      usersStateMap[gameId.gameid][arr[i]].position = i;
    }
    game.moveposition = +game.moveposition - 1;
    let userInfo = await UserInfo.findOne({
      where: {
        userid: socket.user.userid
      }
    })
    if (userInfo) {
      userInfo.lossamount = +userInfo.lossamount + 1;
    } else {
      userInfo = UserInfo.build({
        userid: +socket.user.userid,
        lossamount: 1,
        winamount: 0
      })
    }
    await userInfo.save();
    tabsArr.forEach(item => {
      socketsMap[item].emit("game/blownUp", {blownUp: true})
    })
    // socket.emit("game/blownUp", {blownUp: true})

    if (arr.length === 1) {

      let user = await Users.findOne({
        include: [{
          model: Tabs,
          required: true,
          where: {
            tabid: arr[0]
          }
        }]
      })

      let win = await UserInfo.findOne({
        where: {
          userid: user.userid
        }
      })
      if (win) {
        win.winamount = +win.winamount + 1;
      } else {
        win = UserInfo.build({
          userid: user.userid,
          winamount: 1,
          lossamount: 0
        })
      }

      let playerWinner = await Users.findOne({
        include: [{
          model: Tabs,
          required: true,
          where: {
            tabid: arr[0]
          }
        }]
      });

      let tabsGames = await Tabs.findAll({
        where: {
          userid: playerWinner.userid
        }
      })

      let tabsGamesArr = tabsGames.map(item => item.tabid);

      let tabsInGame = await Tabs.findAll({
        where: {
          tabid: tabsGamesArr,
          gameid: gameId.gameid
        }
      })

      let tabsArr = tabsInGame.map(item => {
        return item.tabid
      })

      tabsArr.forEach(item => {
        game.createViewer({
          tabid: item
        })
        socketsMap[item].emit("game/win", {win: true})
      })

      delete usersStateMap[gameId.gameid][arr[0]]
      socketsMap[arr[0]].emit("game/surrendered", {surrendered: true});
      await win.save();
      game.isfinished = true;
      game.isplaying = false;
      // socketsMap[arr[0]].emit("game/win", {win: true})
    }
  }

  let counterOpenedCells = 0;
  let counterCells = 0;

  for (let i = 0; i < gamesMap[gameId.gameid].length; i++) {
    for (let j = 0; j < gamesMap[gameId.gameid][0].length; j++) {
      counterCells++;
      if (gamesMap[gameId.gameid][i][j].isOpen) {
        counterOpenedCells++;
      }
    }
  }


  console.log(gamesMap[gameId.gameid])
// socketsMap[gameId.gameid]


  let arrAnother = Object.keys(usersStateMap[gameId.gameid]);
  if (arrAnother.length <= +game.moveposition + 1) {
    game.moveposition = 0;
  } else {
    game.moveposition = +game.moveposition + 1;
  }

  await game.save();


  if (arrAnother.length > 1) {
    await changeMove(gameId.gameid, socket.user.userid);
  }


  if (isMine) {
    delete usersStateMap[gameId.gameid][socket.handshake.query.tabId]
  }

  let viewers = await Viewers.findAll({
    where: {
      islive: true,
      gameid: game.gameid
    }
  })

  let allViewers = await Viewers.findAll({
    where: {
      gameid: game.gameid
    }
  })

  let tabs = viewers.map(item => {
    return item.tabid
  })

  let usersTabs = await Users.findAll({
    include: [{
      model: Tabs,
      required: true,
      where: {
        tabid: tabs
      }
    }]
  })

  let history = await History.findAll({
    where: {
      type: 'action',
      gameid: gameId.gameid
    }
  })

  history.sort((a, b) => Date.parse(a.createdat) - Date.parse(b.createdat))

  let listUsersInGame = await Tabs.findAll({
    where: {
      gameid: gameId.gameid
    }
  })

  let userInfoTmp = await UserInfo.findAll()

  let socketsList = Object.values(socketsMap);

  let activeGamesList = await Games.findAll();

  socketsList.forEach(item => {
    item.emit('game/playerStats', {playerStats: userInfoTmp})
    item.emit('game/list', activeGamesList);
  })

  let arrTmp = [];
// let arrViewers = viewers
  listUsersInGame.forEach(item => {
    let arr = [];
    allViewers.forEach(viewer => {
      arr.push(viewer.tabid);
      if (item.tabid === viewer.tabid && viewer.islive === true) {
        arrTmp.push(item);
      }
    })
    if (!arr.includes(item.tabid)) {
      arrTmp.push(item);
    }
  })


  if (counterOpenedCells === counterCells - +game.amountofmines) {
    console.log(usersStateMap[gameId.gameid]);

    let listUsersInGame = await Tabs.findAll({
      where: {
        gameid: gameId.gameid
      }
    })

    let listTabsInGame = listUsersInGame.map(tab => tab.tabid)


    let viewersAll = await Viewers.findAll({
      where: {
        gameid: gameId.gameid
      }
    });

    let viewersTabs = viewersAll.map(item => item.tabid);

    let newFilterList = listTabsInGame.filter(item => {
      if (!viewersTabs.includes(item)) {
        return true;
      }
    })

    let usersUniq = await Users.findAll({
      include: [{
        model: Tabs,
        required: true,
        where: {
          tabid: newFilterList
        }
      }]
    })

    newFilterList.forEach(item => {
      game.createViewer({
        tabid: item
      })
      socketsMap[item].emit("game/win", {win: true})

      if (usersStateMap[gameId.gameid][item]) {
        delete usersStateMap[gameId.gameid][item]
      }
      socketsMap[item].emit("game/surrendered", {surrendered: true});
    })

    for (let i = 0; i < usersUniq.length; i++) {
      let win = await UserInfo.findOne({
        where: {
          userid: usersUniq[i].userid
        }
      })
      if (win) {
        win.winamount = +win.winamount + 1;
      } else {
        win = UserInfo.build({
          userid: usersUniq[i].userid,
          winamount: 1,
          lossamount: 0
        })
      }
      await win.save();
    }
    // await win.save();
    game.isfinished = true;
    game.isplaying = false;


  }


  arrTmp.forEach(item => {
    socketsMap[item.tabid].emit('game/action', {dataTable: gamesMapClient[gameId.gameid], isMine})
  })

  listUsersInGame.forEach(item => {
    socketsMap[item.tabid].emit('game/listViewers', {listViewers: usersTabs})
    socketsMap[item.tabid].emit('game/listReadiness', {listReadiness: usersStateMap[gameId.gameid], gameOwner})
    socketsMap[item.tabid].emit('game/listLogs', {history})
  })

  viewers.forEach(item => {
    socketsMap[item.tabid].emit('game/listViewers', {listViewers: usersTabs})
    socketsMap[item.tabid].emit('game/action', {dataTable: gamesMapClient[gameId.gameid], isMine})
    socketsMap[item.tabid].emit('game/listReadiness', {listReadiness: usersStateMap[gameId.gameid], gameOwner})
    socketsMap[item.tabid].emit('game/listLogs', {history})
  })

  allViewers.forEach(item => {
    socketsMap[item.tabid].emit('game/playerStats', {playerStats: userInfoTmp})
    socketsMap[item.tabid].emit('game/listLogs', {history})
  })

  console.log(gamesMap[gameId.gameid])
}

module.exports = gameAction;