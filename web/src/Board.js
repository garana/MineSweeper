
import React, { Component } from 'react';

class Board extends Component {

	render() {

		let width = this.props.width;
		let height = this.props.height;

		return (
			<div>
				Board {{width}} x {{height}}
			</div>
		)
	}
}

export default Board;
