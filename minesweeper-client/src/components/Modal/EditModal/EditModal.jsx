import React from "react";
import optionsArr from '../../../common/optionsArr';
import minesPercents from '../../../common/minesPercents';
import {setGameInfo, setGameInfoAndSetTable} from "../../../redux/reducers/gameReducer";

class EditModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fieldSize: '3x3',
      gameName: '',
      maxPlayers: 10,
      minesAmount: 2,
    }
  }

  onChangeGameName = (e) => {
    this.setState({
      gameName: e.target.value
    })
  }

  onChangeFieldSize = (e) => {
    let arrValue = e.target.value.split('x');
    console.log(arrValue);
    this.setState({
      fieldSize: `${arrValue[0]}x${arrValue[1]}`,
      minesAmount: arrValue[2]
    })
  }

  onChangeMaxPlayers = (e) => {
    this.setState({
      maxPlayers: +e.target.value
    })
  }

  onChangeMinesAmount = (e) => {
    this.setState({
      minesAmount: +e.target.value
    })
  }

  createGame = () => {
    console.log(this.state)
    this.props.socket.emit('game/create', {gameInfo: this.state}, (data) => {
    })
  }

  calcMines = (name, level) => {
    let arrSize = name.split('x');
    return Math.round(arrSize[0]*arrSize[1] * minesPercents[level] / 100)
  }


  render() {

    let regex = /^([1-9]|10)$/;

    return (
      <div>
        <div className="modal-body">
          <input value={this.state.gameName} onChange={this.onChangeGameName} placeholder={"game name"} type="text"/>
          <select defaultValue={'DEFAULT'} onChange={this.onChangeFieldSize} name="select">
            <option value={'DEFAULT'} disabled={true}>Choose field size</option>
            {optionsArr.map((item,index) => <option key={index} value={`${item.name}x${this.calcMines(item.name, item.level)}`}>{item.name} mines: {this.calcMines(item.name, item.level)} {item.level}</option>)}
          </select>
          {/*<input value={this.state.minesAmount} onChange={this.onChangeMinesAmount} placeholder={"amount of mines"}*/}
          {/*       type="text"/>*/}
          <input value={this.state.maxPlayers} onChange={this.onChangeMaxPlayers} placeholder={"max players (1-10)"}
                 type="text"/>
        </div>
        <button onClick={() => {
          this.createGame()
        }}>Create game
        </button>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => this.props.closeModal()}>Close</button>
        </div>
      </div>
    )
  }
}

export default EditModal;