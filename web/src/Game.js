
import React, { Component } from 'react';

import Board from './Board';
import StatusBar from './StatusBar';
import NewGameForm from "./NewGameForm";

import API from './API';

class Game extends Component {

	constructor(props) {
		super(props);

		this.state = {
			// currentGame: {"bombs":5,"width":5,"height":5,"board":[[["",1],["",2],["",3],["",2],["",1]],[["",2],["",2],["",2],["",2],["",1]],[["",0],["",2],["",2],["",0],["",0]],[["",1],["",1],["",1],["",1],["",0]],[["",0],["",1],["",1],["",1],["",0]]]},
			// currentGame: {"bombs":5,"width":5,"height":5,"board":[[["v",1],["v",1],["",2],["",1],["",2]],[["v",1],["",1],["",3],["",2],["",1]],[["",1],["",2],["",0],["",3],["",2]],[["",0],["",2],["",2],["",1],["",2]],[["",2],["",0],["",1],["",2],["v",1]]]},
			// currentGame: {"bombs":5,"width":5,"height":5,"board":[[["v",1],["v",1],["",2],["",1],["",2]],[["v",1],["",1],["",3],["",2],["",1]],[["",1],["",2],["",0],["",3],["",2]],[["",0],["",2],["",2],["",1],["f",2]],[["",2],["",0],["",1],["",2],["v",1]]]},
			currentGame: null
		};

		this.handleCellClick = this.handleCellClick.bind(this);

	}

	componentDidMount() {
		API.getGame().then( (response) => {
			this.setState( { currentGame: response } );
		})
	}

	handleCellClick(irow, icell) {
		console.log(`got a click in ${irow},${icell}`);
	}

	createNewGame(newGame) {

		API.createGame(newGame).then( (newGame) => {
			this.setState( { currentGame: newGame } );
		})
		// // TODO call API
		// // curl -v -d 'width=5&height=5' http://localhost:3088/game; echo
		//
		// this.setState( (prevState, props) => {
		// 	return {
		// 		currentGame: {
		// 			width: newGame.width,
		// 			height: newGame.height,
		// 			bombs: newGame.bombs
		// 		}
		// 	}
		// })
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
						<NewGameForm
							createNewGame={this.createNewGame.bind(this)}/>
				}
			</div>
		)
	}

}

export default Game;
