
import React, { Component } from 'react';

class Board extends Component {

	constructor(props) {
		super(props)
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
				<div>Board {width} x {height}</div>
				<table>
					{
						board.map( (row, irow) => {
							return <tr key={`row-${irow}`}>
								{
									row.map( (cell, icell) => {
										return <td
											key={`cell-${icell}`}
											onClick={handleCellClick.bind(null, irow, icell)}
										>{cell[1]}</td>
									})
								}
							</tr>
						})
					}
				</table>
			</div>
		)
	}
}

export default Board;
