import React from "react";
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';
import classes from './Game.module.css';
import {createMines} from "../../utils/createMines";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBomb} from "@fortawesome/free-solid-svg-icons";
import {faFlag} from "@fortawesome/free-solid-svg-icons";
import {checkCell, findMine, getInfoGame, setFlag} from "../../redux/reducers/gameReducer";
import colorsArray from "../../common/colorsArray";


class Game extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isGaming: true,
      isRender: false,
      isReady: false
    }
  }

  onReady = () => {
    this.props.socket.emit("game/readiness", {isReady: true, gameId: this.props.match.params.gameId}, (data) => {
    })
    this.setState({
      isReady: true
    })
  }

  onNotReady = () => {
    this.props.socket.emit("game/readiness", {isReady: false, gameId: this.props.match.params.gameId}, (data) => {
    })
    this.setState({
      isReady: false
    })
  }

  startGame = () => {
    this.props.socket.emit("game/start", {gameId: this.props.match.params.gameId})
    this.props.getInfoGame(this.props.match.params.gameId);
  }

  onSurrender = () => {
    this.props.socket.emit("game/surrender", {gameId: this.props.match.params.gameId})
    // this.props.getInfoGame(this.props.match.params.gameId);
  }

  onShowHistory = (action) => {
    this.props.socket.emit("game/showHistory", {action})
    // this.props.getInfoGame(this.props.match.params.gameId);
  }

  onExitFromGame = () => {
    this.props.socket.emit("game/exit");
    this.props.history.push(`/`);
  }

  render() {

    console.log("this.props.usersReadiness", this.props.usersReadiness)
    console.log("this.props.informationGame.isplaying", this.props.informationGame)
    let isGameOver = this.props.isGameOver;

    const sendAction = (i, j) => {
      // this.props.checkCell(i, j)
      if (this.props.tableTwoDimensional[i][j].isFlag) {
        return;
      }
      this.props.socket.emit("game/action", {i, j}, (data) => {
      })
    }

    const sendDoubleAction = (i, j) => {
      // this.props.tableTwoDimensional[i][j]
      let table = JSON.parse(JSON.stringify(state.tableTwoDimensional));
      let amountMines = 0;
      (table[i][j - 1] && table[i][j - 1].isFlag) ? amountMines += 1 : amountMines += 0;
      (table[i][j + 1] && table[i][j + 1].isFlag) ? amountMines += 1 : amountMines += 0;
      (table[i - 1] && table[i - 1][j].isFlag) ? amountMines += 1 : amountMines += 0;
      (table[i + 1] && table[i + 1][j].isFlag) ? amountMines += 1 : amountMines += 0;
      (table[i + 1] && table[i + 1][j - 1] && table[i + 1][j - 1].isFlag) ? amountMines += 1 : amountMines += 0;
      (table[i + 1] && table[i + 1][j + 1] && table[i + 1][j + 1].isFlag) ? amountMines += 1 : amountMines += 0;
      (table[i - 1] && table[i - 1][j + 1] && table[i - 1][j + 1].isFlag) ? amountMines += 1 : amountMines += 0;
      (table[i - 1] && table[i - 1][j - 1] && table[i - 1][j - 1].isFlag) ? amountMines += 1 : amountMines += 0;

      this.props.socket.emit("game/double/action", {i, j}, (data) => {
      })
    }

    const setFlag = (e, i, j) => {
      e.preventDefault();
      this.props.setFlag(i, j);
    }


    const checkCell = (i, j) => {
      this.props.checkCell(i, j)
    }

    const findMine = (i, j) => {
      this.props.findMine(i, j)
    }

    let rows = this.props.tableTwoDimensional && this.props.tableTwoDimensional.map(function (item, i) {
      let entry = item.map(function (element, j) {
        return (
          // <td onClick={() => {checkCell(i, j); findMine(i, j)}} className={classes.itemCell} key={j}> {element.isMine ? <FontAwesomeIcon icon={faBomb} /> : (element.isOpen && element.amountOfMines === 0) ? '' : element.amountOfMines} </td>
          // <td onClick={() => {checkCell(i, j); findMine(i, j)}} className={`${element.isBlownUp && classes.blownUpBackground} ${element.isOpen && !element.isMine && element.amountOfMines === 0 && classes.emptyOpened} ${classes.itemCell}`} key={j}> {element.isMine && isGameOver ? <FontAwesomeIcon icon={faBomb} /> : (element.isOpen && !element.isMine && element.amountOfMines > 0 && element.amountOfMines) } </td>
          <td onDoubleClick={sendDoubleAction(i, j)} onContextMenu={(e) => {
            setFlag(e, i, j)
          }
          } onClick={() => {
            sendAction(i, j)
          }}
              className={`${element.isBlownUp && classes.blownUpBackground} ${element.isOpen && !element.isMine && element.amountOfMines !== 0 && classes[`background` + colorsArray[element.userId % 10]]} ${element.isOpen && !element.isMine && element.amountOfMines === 0 && classes[`background` + colorsArray[element.userId % 10]]} ${classes.itemCell}`}
              key={j}> {element.isFlag ? <FontAwesomeIcon
            icon={faFlag}/> : element.isMine && element.isBlownUp ? <FontAwesomeIcon
            icon={faBomb}/> : (element.isOpen && !element.isMine && element.amountOfMines > 0 && element.amountOfMines)} </td>
        );
      });
      return (
        <tr key={i}> {entry} </tr>
      );
    });

    let maxPlayers = this.props.gamesList.filter(item => {
      return item.gameid === this.props.match.params.gameId
    })

    let isStarting = this.props.usersReadiness.find(item => {
      return !item.isReady
    })

    let whoMove = this.props.usersReadiness.find(item => {
      return item.movePosition
    })
    return (
      <div className={classes.wrapMain}>
        <div>{this.props.userName}</div>
        <div className={classes.itemBlockLeft}>
          {/*<div onClick={() => {drawingMap(tableTwoDimensional)}}>DRAWING MAP</div>*/}
          {this.props.isGameOver && <div>GAME OVER</div>}
          {this.props.win && <div>YOU ARE WINNER</div>}
          <table>
            {rows}
          </table>
          {!this.props.surrendered && this.props.informationGame.isplaying && <button onClick={() => {
            this.onSurrender()
          }}>Surrender</button>}
          <div>list players:
            {/*<div>owner: {this.props.gameOwner && this.props.gameOwner.username}</div>*/}
            {
              this.props.usersReadiness.map(item => {
                return <div
                  className={`${item.isReady && classes.activeUser} ${item.movePosition && classes.activeMove}`}>{item.username}</div>
              })}</div>

          {this.props.listViewers.length > 0 &&
          <div>list viewers: {this.props.listViewers.map(item => item.username)} </div>}
          {maxPlayers[0] &&
          <div>Players: {this.props.usersInRoom[this.props.match.params.gameId]}/{maxPlayers[0].maxplayers}</div>}
          {this.props.informationGame.isplaying || this.props.surrendered ? '' : (this.props.gameOwner && this.props.gameOwner.username !== JSON.parse(localStorage.getItem('user')).userName) ? !this.props.isReady ?
            <button onClick={() => {
              this.onReady()
            }}>Ready</button> : <button onClick={() => {
              this.onNotReady()
            }}>Not ready</button> : ''}
          {!this.props.informationGame.isplaying && !isStarting ? (maxPlayers[0] && maxPlayers[0].owner == JSON.parse(localStorage.getItem('user')).userId) &&
            <button onClick={() => {
              this.startGame()
            }}>START GAME</button> : ''}
          <button onClick={() => {
            this.onExitFromGame()
          }}>Exit from game
          </button>
        </div>
        <div className={classes.itemBlockRight}>
          {this.props.listLogs.map(item => {
            return <div>
              <button onClick={() => {
                this.onShowHistory(item.history)
              }} className={classes.itemHistory}>{item.username} i: {item.history.i};
                j: {item.history.j} value: {item.amountofmines}</button>
            </div>
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gameInfo: state.gamePage.gameInfo,
  tableTwoDimensional: state.gamePage.tableTwoDimensional,
  isGameOver: state.gamePage.isGameOver,
  socket: state.socketPage.socket,
  gamesList: state.gamePage.gamesList,
  usersInRoom: state.gamePage.usersInRoom,
  usersInGame: state.gamePage.usersInGame,
  usersReadiness: state.gamePage.usersReadiness,
  gameOwner: state.gamePage.gameOwner,
  win: state.gamePage.win,
  informationGame: state.gamePage.informationGame,
  surrendered: state.gamePage.surrendered,
  listViewers: state.gamePage.listViewers,
  listLogs: state.gamePage.listLogs,
  isReady: state.gamePage.isReady,
  userName: state.auth.userName
})

export default withRouter(connect(mapStateToProps, {
  checkCell, findMine, getInfoGame, setFlag
})(Game));
