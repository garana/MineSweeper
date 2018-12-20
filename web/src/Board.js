
import React, { Component } from 'react';
import './Board.css';

class Board extends Component {

	showCell(cell) {

		let [ flags, count ] = cell;

		if (flags.indexOf("m") >= 0)
			return 'X';

		if (flags.indexOf("v") >= 0)
			return count || ' ';

		if (flags.indexOf("f") >= 0)
			return '!';

		return '?';
	}

	render() {

		let currentGame = this.props.currentGame;

		let board = currentGame.board;
		let handleCellClick = this.props.handleCellClick;

		console.log(this.props);

		return (
			<div className={"minesweeper-board"}>
				<table className={"board"}>
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

				<div className={"game-lost"}>
					{
						currentGame.lost ?
							"TOO BAD :(" :
							""
					}
				</div>
			</div>
		)
	}
}

export default Board;
