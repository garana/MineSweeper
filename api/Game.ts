
import {Board} from "./Board";
import {CellState} from "./CellState";

export class Game {

	protected _board: Board;

	constructor(
		readonly id: string,
		readonly width: number,
		readonly height: number,
		_board?: Array< Array<CellState> >,
		_visiblem?: Array< Array< boolean> >) {

		this._board = new Board(width, height, _board, _visiblem);
	}

	static marshall(serialized: string): Game {
		let decoded = JSON.parse(serialized);
		return new this(
			decoded.id,
			decoded.width,
			decoded.height,
			decoded.cellStates,
			decoded.visibleMatrix
		);
	}

	serialize(): string {
		return JSON.stringify({
			id: this.id,
			width: this.width,
			height: this.height,
			cellStates: this._board.cellStates,
			visibleMatrix: this._board.visibleMatrix
		})
	}

}