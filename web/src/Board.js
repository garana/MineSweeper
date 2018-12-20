
import React, { Component } from 'react';

class Board extends Component {

	constructor(props) {
		super(props)
	}

	showCell(cell) {

		let [ flags, count ] = cell;

		if (flags.indexOf("v") >= 0)
			return count;

		if (flags.indexOf("f") >= 0)
			return '!';

		return '?';
	}

	render() {

		let currentGame = this.props.currentGame;

		let width = currentGame.width;
		let height = currentGame.height;
		let board = currentGame.board;
		let handleCellClick = this.props.handleCellClick;

		console.log(this.props);

		return (
			<div>
				<table>
					<tbody>
					{
						board.map( (row, irow) => {
							return <tr key={`row-${irow}`}>
								{
									row.map( (cell, icell) => {
										return <td
											key={`cell-${icell}`}
											onClick={handleCellClick.bind(null, irow, icell)}
										>{this.showCell(cell)}</td>
									})
								}
							</tr>
						})
					}
					</tbody>
				</table>
			</div>
		)
	}
}

export default Board;
