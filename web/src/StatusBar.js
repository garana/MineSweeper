
import React, { Component } from 'react';

class StatusBar extends Component {

	render() {

		let currentGame = this.props.currentGame;
		let clearGame = this.props.clearGame;

		if (!currentGame)
			return "No game loaded";

		return (
			<div>
				Size: {currentGame.height} x {currentGame.width}
				&nbsp; |
				&nbsp;{currentGame.mines} Mines
				&nbsp;&nbsp;
				<button type={"button"} onClick={clearGame}>
					{
						currentGame.lost ?
							"New Game" :
							"Clear Game"
					}
				</button>
			</div>
		)
	}
}

export default StatusBar;
