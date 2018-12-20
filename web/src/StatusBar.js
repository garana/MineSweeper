
import React, { Component } from 'react';

class StatusBar extends Component {

	render() {

		let currentGame = this.props.currentGame;

		return (
			<div>
				Size: {currentGame.height} x {currentGame.width}
				&nbsp; |
				&nbsp;{currentGame.bombs} Bombs
			</div>
		)
	}
}

export default StatusBar;
