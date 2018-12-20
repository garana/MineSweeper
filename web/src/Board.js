
import React, { Component } from 'react';

class Board extends Component {

	render() {

		let width = this.props.width;
		let height = this.props.height;
		let board = this.props.board;

		return (
			<div>
				Board {{width}} x {{height}}
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
