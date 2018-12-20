
import React, { Component } from 'react';

import Board from './Board';
import StatusBar from './StatusBar';

class Game extends Component {

	constructor(props) {
		super(props);

		this.state = {
			// currentGame: {"bombs":5,"width":5,"height":5,"board":[[["",1],["",2],["",3],["",2],["",1]],[["",2],["",2],["",2],["",2],["",1]],[["",0],["",2],["",2],["",0],["",0]],[["",1],["",1],["",1],["",1],["",0]],[["",0],["",1],["",1],["",1],["",0]]]},
			// currentGame: {"bombs":5,"width":5,"height":5,"board":[[["v",1],["v",1],["",2],["",1],["",2]],[["v",1],["",1],["",3],["",2],["",1]],[["",1],["",2],["",0],["",3],["",2]],[["",0],["",2],["",2],["",1],["",2]],[["",2],["",0],["",1],["",2],["v",1]]]},
			currentGame: {"bombs":5,"width":5,"height":5,"board":[[["v",1],["v",1],["",2],["",1],["",2]],[["v",1],["",1],["",3],["",2],["",1]],[["",1],["",2],["",0],["",3],["",2]],[["",0],["",2],["",2],["",1],["f",2]],[["",2],["",0],["",1],["",2],["v",1]]]},
			newGame: {
				width: 5,
				height: 5,
				bombs: 5
			}
		};

		this.handleCellClick = this.handleCellClick.bind(this);

	}

	handleNewGameWidthChange(event) {
		this.setState( (prevState, props) => {
			return {
				newGame: {
					...prevState.newGame,
					width: event.target.value
				}
			}
		})
	}

	handleNewGameHeightChange(event) {
		this.setState( (prevState, props) => {
			return {
				newGame: {
					...prevState.newGame,
					height: event.target.value
				}
			}
		})
	}

	handleNewGameClick() {
		this.setState( (prevState, props) => {
			this.createNewGame();
		})
	}

	handleCellClick(irow, icell) {
		console.log(`got a click in ${irow},${icell}`);
	}

	createNewGame() {
		// TODO call API
		// curl -v -d 'width=5&height=5' http://localhost:3088/game; echo
		this.setState( (prevState, props) => {
			return {
				currentGame: {
					width: this.state.newGame.width,
					height: this.state.newGame.height,
				}
			}
		})
	}

	render() {

		let currentGame = this.state.currentGame;

		return (
			<div>
				<StatusBar
					currentGame={currentGame}
				/>
				{
					currentGame ?
						<Board
							currentGame={currentGame}
							handleCellClick={this.handleCellClick}
						/> :
						<div className={"new-game"}>
							<div className={"button"}>
								New Game
							</div>
						</div>
				}
			</div>
		)
	}

}

export default Game;
