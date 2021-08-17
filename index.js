const express = require('express');
const app = express();
const cors = require("cors");
const httpServer = require("http").createServer(app);
const passport = require("passport");
const sequelize = require('./config/database');
const auth = require('./routes/auth');
const games = require('./routes/games');
const Users = require('./models/Users');
const Games = require('./models/Games');
const History = require('./models/History');
const Viewers = require('./models/Viewers');
const Moves = require('./models/Moves');
const Tabs = require('./models/Tabs');
const UserInfo = require('./models/UserInfo');
const usersRoute = require('./routes/users');
const jwt = require("jsonwebtoken");
const keys = require('./config/keys');
const createGame = require('./helpers/createGame');
const generateUID = require('./helpers/generateUID');
const setPosition = require('./helpers/setPosition');
const setFlag = require('./helpers/setFlag');
const changeMove = require('./helpers/changeMove');
const gameAction = require('./helpers/gameAction');
const surrender = require('./helpers/surrender');
const gamesMap = require('./common/gamesMap');
const gamesMapByTabs = require('./common/gamesMapByTabs');
const gamesMapClient = require('./common/gamesMapClient');
const gamesMapClientInitial = require('./common/gamesMapClientInitial');
const gamesMapClientHistory = require('./common/gamesMapClientHistory');
const socketsMap = require('./common/socketsMap');
const usersStateMap = require('./common/usersStateMap');
const doAction = require('./helpers/doAction');
const doActionForLogs = require('./helpers/doActionForLogs');
const {Sequelize} = require('sequelize');
const Op = Sequelize.Op;
const exitFromGame = require('./helpers/exitFromGame');
const serveStatic = require('serve-static');
const path = require('path');

//Test DB
app.use(cors());
app.use(express.json());
app.use(serveStatic(path.join(__dirname, 'build')));

sequelize.authenticate().then(() => {
  console.log("Database connected...")
}).catch((err) => {
  console.log("Error:" + err);
})

app.use(auth);
app.use(games);
app.use(usersRoute);
// app.use(history);

app.use(passport.initialize());
require('./middleware/passport')(passport);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: '*',
  }
});

io.on("connection", async (socket) => {
  let decoded = null
  try {
    decoded = jwt.verify(socket.handshake.query.loggeduser.split(' ')[1], keys.jwt);
  } catch (e) {
    console.log('Invalid token', e)
  }
  if (!decoded) return;
  let user = await Users.getUserByUserId(decoded.userId);
  if (!user) return;
  socket.user = user;

  socketsMap[socket.handshake.query.tabId] = socket;

  let userTab = await Users.findOne({
    include: [{
      model: Tabs,
      required: true,
      where: {
        tabid: socket.handshake.query.tabId
      }
    }]
  })

  user.createTab({tabid: socket.handshake.query.tabId});


  let tabInGame = await Games.findOne({
    include: [{
      model: Tabs,
      required: true,
      where: {
        tabid: socket.handshake.query.tabId
      }
    }]
  })

  let viewerInGame = await Games.findOne({
    include: [{
      model: Viewers,
      required: true,
      where: {
        tabid: socket.handshake.query.tabId
      }
    }]
  })

  if (tabInGame || viewerInGame) {
    let gameid = tabInGame ? tabInGame.gameid : viewerInGame.gameid
    let game = await Games.findOne({
      where: {
        gameid: gameid
      }
    })
    let viewers = await Viewers.findAll({
      where: {
        gameid: gameid
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
        gameid: gameid
      }
    })

    // socket.emit("game/refresh", {gameId: gameid, game: game})
    socket.emit('game/new', {dataTable: gamesMap[gameid], gameId: gameid, game: game})

    socket.emit('game/listLogs', {history})
    socket.emit('game/listViewers', {listViewers: usersTabs})
    socket.emit('game/info', {game})
    // socket.emit('game/list', activeGamesList);
    if (usersStateMap[gameid]) {
      socket.emit('game/listReadiness', {listReadiness: usersStateMap[gameid]})
    }
  }

  let gameId = await Games.findOne({
    include: [{
      model: Tabs,
      required: true,
      where: {
        tabid: socket.handshake.query.tabId
      }
    }]
  })

  let allGames = await Games.findAll();

  let usersInGames = {};
  for (let i = 0; i < allGames.length; i++) {
    let listUsersInGame = await Tabs.findAll({
      where: {
        gameid: allGames[i].gameid
      }
    })

    let listTabsInGame = listUsersInGame.map(tab => tab.tabid)

    let viewersAll = await Viewers.findAll({
      where: {
        gameid: allGames[i].gameid
      }
    });

    let viewersTabs = viewersAll.map(item => item.tabid);

    let newFilterList = listTabsInGame.filter(item => {
      if (!viewersTabs.includes(item)) {
        return true;
      }
    })


    let users = await Users.findAll({
      include: [{
        model: Tabs,
        required: true,
        where: {
          tabid: newFilterList
        }
      }]
    })

    usersInGames[allGames[i].gameid] = users.length;
  }

  // })

  // let listUsersInGame = await Tabs.findAll({
  //   where: {
  //     gameid: gameId.gameid
  //   }
  // })

  // let listUsersInGame = await Tabs.findAll({
  //   where: {
  //     gameid: gameid
  //   }
  // })
  //
  // let listTabsInGame = listUsersInGame.map(tab => tab.tabid)
  //
  //
  // let viewersAll = await Viewers.findAll({
  //   where: {
  //     gameid: gameid
  //   }
  // });
  //
  // let viewersTabs = viewersAll.map(item => item.tabid);
  //
  // let newFilterList = listTabsInGame.filter(item => {
  //   if(!viewersTabs.includes(item)) {
  //     return true;
  //   }
  // })

  // let usersUniq = await Tabs.findAll({
  //   where: {
  //     tabid: newFilterList,
  //     gameid: gameid
  //   }
  // })

  // let usersUniq = await Users.findAll({
  //   include: [{
  //     model: Tabs,
  //     required: true,
  //     where: {
  //       tabid: newFilterList
  //     }
  //   }]
  // })
  //

  let activeGamesList = await Games.findAll();
  // socket.emit('game/users', {usersUniq, gameid: gameid});
  socket.emit('game/list', activeGamesList);
  socket.emit('game/set/users', usersInGames);
  console.log("correct connection");

  socket.on('game/getPlayerStats', async (data, callback) => {

    let userInfo = await UserInfo.findAll()

    socket.emit('game/playerStats', {playerStats: userInfo})
  })

  socket.on('game/double/action', async (data, callback) => {

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


    if (!game.isplaying) {
      return;
    }

    let tableTmp = gamesMap[gameId.gameid];

    let amountOfCloseCells = 0;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (tableTmp[data.i - 1 + i] && tableTmp[data.i - 1 + i][data.j - 1 + j]) {
          if (!tableTmp[data.i - 1 + i][data.j - 1 + j].isOpen) {
            amountOfCloseCells++
          }
        }
      }
    }

    if(amountOfCloseCells === data.minesCoordinate.length) {
      return;
    }

    // if (gamesMap[gameId.gameid][data.i][data.j].isOpen) {
    //   return;
    // }

    let userMove = await Moves.findOne({
      where: {
        gameid: gameId.gameid
      }
    })

    if (!userMove || userMove.userid != socket.user.userid) {
      return;
    }

    let newAction = History.build({
      gameid: gameId.gameid,
      type: 'action',
      history: data,
      username: user.username,
      userid: user.userid,
      amountofmines: +gamesMap[gameId.gameid][data.i][data.j].amountOfMines
    })

    await newAction.save();

    let isMine = false;
    let table = gamesMap[gameId.gameid];
    let tableClient = gamesMapClient[gameId.gameid];
    // data.minesCoordinate.forEach(item => {
    let amountMinesUnderFlags = 0;
    outer: for (let k = 0; k < data.minesCoordinate.length; k++) {

      if (!gamesMap[gameId.gameid][data.minesCoordinate[k][0]][data.minesCoordinate[k][1]].isMine) {

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            if (table[data.i - 1 + i] && table[data.i - 1 + i][data.j - 1 + j]) {
              if (table[data.i - 1 + i][data.j - 1 + j].isOpen === false && table[data.i - 1 + i][data.j - 1 + j].isMine) {
                table[data.i - 1 + i][data.j - 1 + j].isOpen = true;
                table[data.i - 1 + i][data.j - 1 + j].isBlownUp = true;
                tableClient[data.i - 1 + i][data.j - 1 + j].isOpen = true;
                tableClient[data.i - 1 + i][data.j - 1 + j].isMine = true;
                tableClient[data.i - 1 + i][data.j - 1 + j].isBlownUp = true;

                table[data.i - 1 + i][data.j - 1 + j].userId = socket.user.userid;
                tableClient[data.i - 1 + i][data.j - 1 + j].userId = socket.user.userid;

                isMine = true;
                await gameAction(socket, isMine);
                break outer;
              }
              // if (table[item[0] - 1 + i][item[1] - 1 + j].amountOfMines === 0 && table[item[0] - 1 + i][item[1] - 1 + j].isOpen === false) {
              //   arr.push(table[item[0].i - 1 + i][item[0].j - 1 + j])
              // }
              // table[data.i - 1 + i][data.j - 1 + j].isOpen = true;

            }
          }
        }

      } else {
        amountMinesUnderFlags++;
      }
    }
    if (amountMinesUnderFlags === data.minesCoordinate.length) {

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (table[data.i - 1 + i] && table[data.i - 1 + i][data.j - 1 + j]) {
            if (table[data.i - 1 + i][data.j - 1 + j].isOpen === false && !table[data.i - 1 + i][data.j - 1 + j].isMine) {
              await doAction({i: data.i - 1 + i, j: data.j - 1 + j}, gameId.gameid, socket.user.userid)

            }

          }
        }
      }

      await gameAction(socket, isMine);

    }


    console.log(1);

  })


  socket.on('game/create', async (data, callback) => {
      if (!data) {
        return callback('Incorrect data');
      }
      let gameId = generateUID();
      let dataTable = createGame(data.gameInfo, gameId);
      gamesMap[gameId] = dataTable;

      gamesMapByTabs[gameId] = {};
      gamesMapByTabs[gameId][socket.handshake.query.tabId] = dataTable;

      socket.emit('game/new', {dataTable: [], gameId});
      let newGame = Games.build({
        maxplayers: data.gameInfo.maxPlayers,
        fieldsize: data.gameInfo.fieldSize,
        amountofmines: data.gameInfo.minesAmount,
        gameid: gameId,
        gamename: data.gameInfo.gameName,
        owner: socket.user.userid
      })

      await newGame.save();

      newGame.createTab({tabid: socket.handshake.query.tabId});
      let newHistory = History.build({
        gameid: gameId,
        type: 'state',
        history: dataTable,
        username: user.username,
        userid: user.userid,
      })
      await newHistory.save();

      let activeGamesList = await Games.findAll();

      let socketsList = Object.values(socketsMap);

      let listUsersInGame = await Tabs.findAll({
        where: {
          gameid: gameId
        }
      })

      let gameOwner = await Users.findOne({
        where: {
          userid: newGame.owner
        }
      })

      usersStateMap[gameId] = {
        [socket.handshake.query.tabId]: {
          isReady: true,
          username: socket.user.username,
          userid: socket.user.userid
        }
      };


      socket.emit('game/info', {game: newGame})

      socketsList.forEach(item => {
        item.emit('game/list', activeGamesList);
        item.emit('game/users', {usersUniq: listUsersInGame, gameid: gameId});
        // item.emit('game/listReadiness', {listReadiness: usersStateMap[gameId], gameOwner})
      })

      listUsersInGame.forEach(item => {
        socketsMap[item.tabid].emit('game/listReadiness', {listReadiness: usersStateMap[gameId], gameOwner})
      })

    }
  )

  socket.on('game/return/live', async (data, callback) => {

  })

  socket.on("game/join", async (data, callback) => {

    let dataTable = gamesMap[data.gameId];

    let game = await Games.findOne({
      where: {
        gameid: data.gameId
      }
    })


    let gameOwner = await Users.findOne({
      where: {
        userid: game.owner
      }
    })

    // let user = await Games.findOne({
    //   include: [{
    //     model: Tabs,
    //     required: true,
    //     where: {
    //       tabid: socket.handshake.query.tabId
    //     }
    //   }]
    // })

    let tabsGames = await Tabs.findAll({
      where: {
        gameid: data.gameId
      }
    })

    let tabsArr = tabsGames.map(item => item.tabid);

    let userGames = await Users.findOne({
      include: [{
        model: Tabs,
        required: true,
        where: {
          userid: socket.user.userid,
          tabid: tabsArr
        }
      }]
    })

    if (userGames) {

      // usersStateMap[gameid][socket.handshake.query.tabId]

      let listUsersInGame = await Tabs.findAll({
        where: {
          gameid: data.gameId
        }
      })

      let viewers = await Viewers.findAll({
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

      for (let key in usersStateMap[data.gameId]) {
        if (usersStateMap[data.gameId][key].userid == socket.user.userid) {
          socket.emit('game/isReady', {isReady: usersStateMap[data.gameId][key].isReady})
        }
      }


      if (game.isplaying) {
        game.createTab({tabid: socket.handshake.query.tabId});


        let listTabsInGame = listUsersInGame.map(tab => tab.tabid)

        let users = await Users.findAll({
          include: [{
            model: Tabs,
            required: true,
            where: {
              tabid: listTabsInGame
            }
          }]
        })


        // socket.emit('game/new', {dataTable: gamesMap[data.gameId], gameId: data.gameId})
        socket.emit('game/new', {dataTable: gamesMapClient[data.gameId], gameId: data.gameId})


        socket.emit('game/users', {usersUniq: users, gameid: data.gameId});
        if (usersStateMap[data.gameId]) {
          socket.emit('game/listReadiness', {listReadiness: usersStateMap[data.gameId], gameOwner})
        }
        socket.emit('game/listViewers', {listViewers: usersTabs})
        socket.emit('game/info', {game})
        return;
      } else {

        // usersStateMap[data.gameId][socket.handshake.query.tabId] = {
        //   isReady: false,
        //   username: socket.user.username,
        //   userid: socket.user.userid
        // }
        game.createTab({tabid: socket.handshake.query.tabId});

        let listTabsInGame = listUsersInGame.map(tab => tab.tabid)

        let users = await Users.findAll({
          include: [{
            model: Tabs,
            required: true,
            where: {
              tabid: listTabsInGame
            }
          }]
        })

        socket.emit('game/new', {dataTable: [], gameId: data.gameId})
        socket.emit('game/users', {usersUniq: users, gameid: data.gameId});
        if (usersStateMap[data.gameId]) {
          socket.emit('game/listReadiness', {listReadiness: usersStateMap[data.gameId], gameOwner})
        }

        socket.emit('game/listViewers', {listViewers: usersTabs})
        socket.emit('game/info', {game})
        return;
      }

    }


    if (data.isViewer || (!data.isViewer && game.isplaying)) {
      await game.createViewer({tabid: socket.handshake.query.tabId});
      await game.createTab({tabid: socket.handshake.query.tabId});

      socket.emit("game/surrendered", {surrendered: true});
    } else {
      await game.createTab({tabid: socket.handshake.query.tabId});

      if (!usersStateMap[data.gameId]) {
        usersStateMap[data.gameId] = {
          [socket.handshake.query.tabId]: {
            isReady: false,
            username: socket.user.username,
            userid: socket.user.userid
          }
        };
      }
      usersStateMap[data.gameId][socket.handshake.query.tabId] = {
        isReady: false,
        username: socket.user.username,
        userid: socket.user.userid
      };

    }

    gamesMapByTabs[data.gameId][socket.handshake.query.tabId] = dataTable

    if (game.isplaying) {
      // socket.emit('game/new', {dataTable: gamesMap[data.gameId], gameId: data.gameId})
      socket.emit('game/new', {dataTable: gamesMapClient[data.gameId], gameId: data.gameId})
    } else {
      socket.emit('game/new', {dataTable: [], gameId: data.gameId});
    }


    let socketsList = Object.values(socketsMap);
    let listUsersInGame = await Tabs.findAll({
      where: {
        gameid: data.gameId
      }
    })
    let listUsers = [];
    let flags = [];
    listUsersInGame.forEach(item => {
      if (!flags[item.tabid]) {
        flags[item.tabid] = true;
      }
      listUsers.push(item);
    })

    let listTabsInGame = listUsersInGame.map(tab => tab.tabid)


    let viewersAll = await Viewers.findAll({
      where: {
        gameid: data.gameId
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


    socketsList.forEach(item => {
      let users = Object.values(usersStateMap[data.gameId]);
      users.push(data.gameId)
      item.emit('game/users', {usersUniq, gameid: data.gameId});
    })

    let viewers = await Viewers.findAll({
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

    // let usersViewers = await Users.findAll({
    //     where: {
    //       userid: [usersid]
    //     }
    // })

    let history = await History.findAll({
      where: {
        type: 'action',
        gameid: game.gameid
      }
    })

    history.sort((a, b) => Date.parse(a.createdat) - Date.parse(b.createdat))

    socket.emit('game/listLogs', {history})

    listUsersInGame.forEach(item => {
      socketsMap[item.tabid].emit('game/listReadiness', {listReadiness: usersStateMap[data.gameId], gameOwner})
      socketsMap[item.tabid].emit('game/listViewers', {listViewers: usersTabs})
      socketsMap[item.tabid].emit('game/info', {game})
    })


    viewers.forEach(item => {
      socketsMap[item.tabid].emit('game/listReadiness', {listReadiness: usersStateMap[data.gameId], gameOwner})
      socketsMap[item.tabid].emit('game/listViewers', {listViewers: usersTabs})
      socketsMap[item.tabid].emit('game/info', {game})
    })

  })

  socket.on('game/showHistory', async (data, callback) => {

    let gameId = await Games.findOne({
      include: [{
        model: Viewers,
        required: true,
        where: {
          tabid: socket.handshake.query.tabId
        }
      }],
    })

    let viewer = await Viewers.findOne({
      where: {
        tabid: socket.handshake.query.tabId,
        gameid: gameId.gameid
      }
    })

    if (!viewer) {
      return;
    }

    let actionTime = await History.findOne({
      where: {
        gameid: gameId.gameid,
        history: data.action
      }
    })

    let history = await History.findAll({
      where: {
        gameid: gameId.gameid,
        // createdat: {
        //   [Op.lte]: actionTime.createdat
        // }
      }
    })

    history.sort((a, b) => Date.parse(a.createdat) - Date.parse(b.createdat))

    if (history[history.length - 1].history.i === data.action.i && history[history.length - 1].history.j === data.action.j) {
      viewer.islive = true;
      socket.emit('game/action', {dataTable: gamesMapClient[gameId.gameid]});
      await viewer.save();
      return;
    }

    viewer.islive = false;

    await viewer.save();


    let filteredHistory = history.filter(item => {
      return Date.parse(item.createdat) <= Date.parse(actionTime.createdat)
    })
    filteredHistory.sort((a, b) => Date.parse(a.createdat) - Date.parse(b.createdat))

    let state = filteredHistory[0]
    let actionsArr = filteredHistory.slice(1)
    let table = JSON.parse(JSON.stringify(state.history));
    // let table = JSON.parse(JSON.stringify(gamesMapClient[gameId.gameid]));
    let gamesMapClientHistoryTmp = JSON.parse(JSON.stringify(gamesMapClientInitial[gameId.gameid]));
    gamesMapClientHistory[gameId.gameid] = gamesMapClientHistoryTmp;
    for (let j = 0; j < actionsArr.length; j++) {
      table = doActionForLogs(actionsArr[j].history, table, actionsArr[j].userid, gameId.gameid);
    }

    socket.emit('game/action', {dataTable: gamesMapClientHistory[gameId.gameid]});

  })

  socket.on('game/surrender', async (data, callback) => {

    surrender(socket);

  })

  socket.on('game/setFlag', async (data, callback) => {

//     let gameId = await Games.findOne({
//       include: [{
//         model: Tabs,
//         required: true,
//         where: {
//           tabid: socket.handshake.query.tabId
//         }
//       }],
//     })
//
//
//     let tmp = await setFlag(socket, gameId.gameid, data);
// console.log(tmp);
  })

  socket.on('game/action', async (data, callback) => {
    if (!data) {
      return callback('Incorrect data');
    }

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


    if (!game.isplaying) {
      return;
    }

    if (gamesMap[gameId.gameid][data.i][data.j].isOpen) {
      return;
    }


    let userMove = await Moves.findOne({
      where: {
        gameid: gameId.gameid
      }
    })

    if (!userMove || userMove.userid != socket.user.userid) {
      return;
    }

    let newAction = History.build({
      gameid: gameId.gameid,
      type: 'action',
      history: data,
      username: user.username,
      userid: user.userid,
      amountofmines: +gamesMap[gameId.gameid][data.i][data.j].amountOfMines
    })

    await newAction.save();

    let isMine = doAction(data, gameId.gameid, socket.user.userid);


    let gameOwner = await Users.findOne({
      where: {
        userid: game.owner
      }
    })

    //click on Mine

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
    // socketsMap[gameId.gameid]


    let arr = Object.keys(usersStateMap[gameId.gameid]);
    if (arr.length <= +game.moveposition + 1) {
      game.moveposition = 0;
    } else {
      game.moveposition = +game.moveposition + 1;
    }

    await game.save();


    if (arr.length > 1) {
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

    let userInfo = await UserInfo.findAll()

    let socketsList = Object.values(socketsMap);

    let activeGamesList = await Games.findAll();

    socketsList.forEach(item => {
      item.emit('game/playerStats', {playerStats: userInfo})
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
      socketsMap[item.tabid].emit('game/playerStats', {playerStats: userInfo})
      socketsMap[item.tabid].emit('game/listLogs', {history})
    })

  })

  socket.on('game/exit', async (data, callback) => {

    await exitFromGame(socket);

  })

  socket.on('game/readiness', async (data, callback) => {

    for (let key in usersStateMap[data.gameId]) {
      if (usersStateMap[data.gameId][key].userid == socket.user.userid) {
        usersStateMap[data.gameId][key].isReady = data.isReady;
      }
    }
    // usersStateMap[data.gameId][socket.handshake.query.tabId].isReady = data.isReady;

    let listUsersInGame = await Tabs.findAll({
      where: {
        gameid: data.gameId
      }
    })
    let game = await Games.findOne({
      where: {
        gameid: data.gameId
      }
    })
    let gameOwner = await Users.findOne({
      where: {
        userid: game.owner
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
        gameid: data.gameId
      }
    })

    let tabsArr = tabsInGame.map(item => {
      return item.tabid
    })

    listUsersInGame.forEach(item => {
      socketsMap[item.tabid].emit('game/listReadiness', {listReadiness: usersStateMap[data.gameId], gameOwner})
    })

    tabsArr.forEach(item => {
      socketsMap[item].emit('game/isReady', {isReady: data.isReady})
    })

  })

  socket.on('game/start', async (data, callback) => {
    let dataTable = gamesMap[data.gameId];
    let dataTableClient = gamesMapClient[data.gameId];
    let game = await Games.findOne({
      where: {
        gameid: data.gameId
      }
    })
    game.isplaying = true;
    await game.save();
    let listUsersInGame = await Tabs.findAll({
      where: {
        gameid: data.gameId
      }
    })

    let activeGamesList = await Games.findAll();
    let socketsList = Object.values(socketsMap);
    socketsList.forEach(item => {
      item.emit('game/list', activeGamesList);
    })

    let gameOwner = await Users.findOne({
      where: {
        userid: game.owner
      }
    })

    await setPosition(data.gameId);

    let viewers = await Viewers.findAll({
      where: {
        islive: true,
        gameid: game.gameid
      }
    })

    let allViewers = await Viewers.findAll({
      where: {
        gameid: data.gameId
      }
    })

    let tabs = allViewers.map(item => {
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

    listUsersInGame.forEach(item => {
      socketsMap[item.tabid].emit('game/new', {dataTable: dataTableClient, gameId: data.gameId});
      socketsMap[item.tabid].emit('game/listReadiness', {listReadiness: usersStateMap[data.gameId], gameOwner})
      socketsMap[item.tabid].emit('game/info', {game})
      socketsMap[item.tabid].emit('game/listViewers', {listViewers: usersTabs})
    })

    viewers.forEach(item => {
      socketsMap[item.tabid].emit('game/new', {dataTable: dataTableClient, gameId: data.gameId});
      socketsMap[item.tabid].emit('game/listReadiness', {listReadiness: usersStateMap[data.gameId], gameOwner})
      socketsMap[item.tabid].emit('game/info', {game})
      socketsMap[item.tabid].emit('game/listViewers', {listViewers: usersTabs})
    })

  })

  socket.on('disconnect', async (data) => {

    // await Tabs.destroy({
    //   where: {
    //     tabid: socket.handshake.query.tabId
    //   }
    // })
    //
    // let tabInGame = await Games.findOne({
    //   include: [{
    //     model: Tabs,
    //     required: true,
    //     where: {
    //       tabid: socket.handshake.query.tabId
    //     }
    //   }]
    // })
    //
    // let viewerInGame = await Games.findOne({
    //   include: [{
    //     model: Viewers,
    //     required: true,
    //     where: {
    //       tabid: socket.handshake.query.tabId
    //     }
    //   }]
    // })
    //
    // if (tabInGame || viewerInGame) {
    //   let gameid = tabInGame ? tabInGame.gameid : viewerInGame.gameid
    //   let game = await Games.findOne({
    //     where: {
    //       gameid: gameid
    //     }
    //   })
    //   if (game.isplaying || game.isfinished) {
    //     return
    //   }
    // }

    await exitFromGame(socket);
  })
})
;

const port = process.env.PORT || 8080;

httpServer.listen(port, () => {
  console.log("Server has started on 8080 port")
});
