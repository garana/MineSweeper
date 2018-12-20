
import React, { Component } from 'react';

import Board from './Board';
import StatusBar from './StatusBar';

class Game extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentGame: null
		}

	}

	render() {

		let currentGame = this.state.currentGame;

		return (
			<div>
				<StatusBar/>
				{
					currentGame ?
						<Board/> :
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
