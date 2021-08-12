import React from "react";
import {connect} from "react-redux";
import {NavLink, withRouter} from 'react-router-dom';
import ModalContainer from "../Modal/ModalContainer";
import {openModal} from "../../redux/reducers/modalReducer";
import EditModalContainer from "../Modal/EditModal/EditModalContainer";
import classes from './Home.module.css'
import {setIsReady} from "../../redux/reducers/gameReducer";

class Home extends React.Component {

  componentDidMount() {

  }

  joinToGame = (gameId) => {
    this.props.setIsReady({isReady: false})
    this.props.socket.emit('game/join', {gameId}, (data) => {
    })
  }

  joinToGameAsViewer = (gameId) => {
    this.props.socket.emit('game/join', {gameId, isViewer: true}, (data) => {
    })
  }

  render() {
    return (
      <div className={classes.wrapper}>
        <div className={classes.leftItem}>
          <NavLink to={'/profile'}>Profile</NavLink>
        </div>
        <div>
          {this.props.userName}
        </div>
        <div className={classes.rightItem}>
          <button onClick={() => {
            this.props.openModal(<EditModalContainer title={'TITLE'} id={33333} text={'TESTEST'}/>)
          }}>Open modal
          </button>
          <ModalContainer/>
          HOME
          <div>
            <span>LIST OF ACTIVE GAMES</span>
            <div>
              {this.props.gamesList.filter(game => !game.isfinished).map(item => {
                return <div>
                  <button onClick={() => {
                    this.joinToGame(item.gameid)
                  }}>
                    <span>Name: {item.gamename} </span>
                    <span>Field: {item.fieldsize} </span>
                    <span>Players: {this.props.usersInRoom[item.gameid]}/{item.maxplayers} </span>
                    <span>Mines: {item.amountofmines} </span>
                    {item.isplaying ? <span>Live</span> : <span>Pending</span>}
                  </button>
                  <button onClick={() => {
                    this.joinToGameAsViewer(item.gameid)
                  }}>Join as Viewer
                  </button>
                </div>
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  gamesList: state.gamePage.gamesList,
  socket: state.socketPage.socket,
  usersInRoom: state.gamePage.usersInRoom,
  userName: state.auth.userName
})

export default withRouter(connect(mapStateToProps, {
  openModal,
  setIsReady
})(Home));
