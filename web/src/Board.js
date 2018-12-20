
import React, { Component } from 'react';

class Board extends Component {

	render() {

		let currentGame = this.props.currentGame;

		let width = currentGame.width;
		let height = currentGame.height;
		let board = currentGame.board;

		console.log(this.props)

		return (
			<div>
				<div>Board {width} x {height}</div>
				<table>
					{
						board.map( (row) => {
							return <tr>
								{
									row.map( (cell) => {
										return <td>{cell[1]}</td>
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
