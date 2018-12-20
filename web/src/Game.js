
import React, { Component } from 'react';

import Board from './Board';
import StatusBar from './StatusBar';
import NewGameForm from "./NewGameForm";

import API from './API';

class Game extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentGame: null,
			loading: true
		};

		this.handleCellClick = this.handleCellClick.bind(this);

	}

	componentDidMount() {
		API.getGame().then( (response) => {
			this.setState( {
				currentGame: response,
				loading: false
			});
		}, (error) => {
			this.setState( {
				currentGame: null,
				loading: false
			});
		})
	}

	cellIsFlagged(x, y) {
		return this.state.currentGame.board[x][y][0].indexOf("f") < 0
	}

	handleCellClick(irow, icell, isFlagging) {
		if (this.state.currentGame &&
			this.state.currentGame.lost)
			return;

		console.log(`got a click in ${irow},${icell} flagging=${!!isFlagging}`);

		let ready = isFlagging ?
			API.flag(irow, icell, this.cellIsFlagged(irow, icell)) :
			API.click(irow, icell);

		ready.then( (response) => {
			this.setState( {
				currentGame: response
			});
		})
	}

	createNewGame(newGame) {

		API.createGame(newGame).then( (newGame) => {
			this.setState( { currentGame: newGame } );
		})

	}

	clearGame() {
		API.resetGame();
		this.setState( { currentGame: null } );
	}

	render() {

		let currentGame = this.state.currentGame;

		if (this.state.loading)
			return "Please wait";

		return (
			<div>
				<StatusBar
					currentGame={currentGame}
					clearGame={this.clearGame.bind(this)}
				/>
				{
					currentGame ?
						<Board
							currentGame={currentGame}
							handleCellClick={this.handleCellClick}
						/> :
						<NewGameForm
							createNewGame={this.createNewGame.bind(this)}
						/>
				}
			</div>
		)
	}

}

export default Game;
