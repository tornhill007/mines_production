import React from "react";
import {connect} from "react-redux";
import {Redirect, withRouter} from "react-router-dom";
import {generateUID} from '../../utils/generateUID'
import {SocketContextProvider} from "../Context/SocketContextProvider";
import {io} from "socket.io-client";
import {setIsRender, setSocket} from "../../redux/reducers/socketReducer";
import {
  setGame,
  setGameOver,
  setGamesList,
  setInformationGame,
  setIsReady,
  setListLogs,
  setListUsersInRoom,
  setListViewers,
  setPlayerStats,
  setSurrendered,
  setUsersInRoom,
  setUsersListReadiness,
  setWin
} from "../../redux/reducers/gameReducer";
import {baseUrl} from '../../common/config/config'

class Auth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isRender: false
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.token && !this.props.isRender) {
      console.log("RENDER")
      let socket;
      socket = io(baseUrl, {
        query: {
          tabId: JSON.parse(sessionStorage.getItem('tabId')),
          loggeduser: this.props.token
        }
      });

      const oldEmit = socket.emit.bind(socket)
      socket.emit = (...args) => {
        console.log('Socket <=:', ...args);
        return oldEmit(...args);
      }

      // console.log("sockett_ID", socket.id)
      socket.on("connect", () => {
        console.log("sockett_ID", socket.id)
        this.props.setSocket(socket);
      });


      socket.on("game/new", (data) => {
        this.props.setGame({game: data.dataTable});
        this.props.setListLogs([]);
        this.props.setSurrendered(false);
        this.props.setWin({win: false});
        this.props.setGameOver({blownUp: false});
        this.props.setListViewers([]);
        if (!data.game) {
          this.props.history.push(`/game/${data.gameId}`)
        } else if (data.game.isplaying || data.game.isfinished) {
          this.props.history.push(`/game/${data.gameId}`)
        }
      })

      socket.on("game/action", (data) => {
        this.props.setGame({game: data.dataTable, isMine: data.isMine});
      })

      socket.on("game/list", (data) => {
        this.props.setGamesList(data);
      })

      socket.on("game/refresh", (data) => {
        if (data.game.isplaying || data.game.isfinished) {
          this.props.history.push(`/game/${data.gameId}`)
        }
      })

      socket.on("game/users", (data) => {
        this.props.setUsersInRoom(data);
      })

      socket.on("game/delete/byOwner", (data) => {
        if (data.gameDeletedByOwner) {
          this.props.history.push(`/`)
        }
        // this.props.setUsersInRoom(data);
      })

      socket.on("game/isReady", (data) => {
        console.log("game_isReady", data)
        this.props.setIsReady(data);
      })

      socket.on("game/listReadiness", (data) => {
        this.props.setUsersListReadiness(data);
      })

      socket.on("game/win", (data) => {
        this.props.setWin(data);
      })

      socket.on("game/blownUp", (data) => {
        this.props.setGameOver(data);
      })

      socket.on("game/info", (data) => {
        this.props.setInformationGame(data.game);
      })

      socket.on("game/surrendered", (data) => {
        this.props.setSurrendered(data.surrendered);
      })

      socket.on("game/listViewers", (data) => {
        this.props.setListViewers(data.listViewers);
      })

      socket.on("game/playerStats", (data) => {
        this.props.setPlayerStats(data.playerStats);
      })

      socket.on("game/listLogs", (data) => {
console.log("data.history", data.history)
        this.props.setListLogs(data.history);
      })

      socket.on("game/set/users", (data) => {
        this.props.setListUsersInRoom(data);
      })

      this.props.setIsRender(true)
    }
  }

  render() {
console.log("render")
    if (!JSON.parse(sessionStorage.getItem('tabId'))) {
      let tabId = generateUID();
      window.sessionStorage.setItem("tabId", JSON.stringify(tabId))
    }


    if (!this.props.token) return <Redirect to={'/login'}/>

    if (this.props.token) {
      return <Redirect to={'/'}/>
    }
  }
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  isRender: state.socketPage.isRender
})


export default withRouter(connect(mapStateToProps, {
  setSocket,
  setGame,
  setIsRender,
  setGamesList,
  setUsersInRoom,
  setUsersListReadiness,
  setGameOver,
  setWin,
  setInformationGame,
  setSurrendered,
  setListViewers,
  setListLogs,
  setPlayerStats,
  setListUsersInRoom,
  setIsReady
})(Auth));