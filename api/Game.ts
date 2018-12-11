
import {Board} from "./Board";
import {CellState} from "./CellState";

export class Game {

	protected _board: Board;

	constructor(
		readonly width: number,
		readonly height: number,
		_board?: Array< Array<CellState> >,
		_visiblem?: Array< Array< boolean> >,
		_flagMatrix?: Array< Array<boolean> >) {

		this._board = new Board(width, height, _board, _visiblem);
	}

	get board(): Board { return this._board }

	toJSON() {
		return {
			width: this.width,
			height: this.height,
			cellStates: this._board.cellStates,
			visibleMatrix: this._board.visibleMatrix,
			flagMatrix: this._board.flagMatrix
		}
	}

	static fromJSON(json) {
		return new this(
			json.width,
			json.height,
			json.cellStates,
			json.visibleMatrix,
			json.flagMatrix
		)
	}

	// static marshall(serialized: string): Game {
	// 	let decoded = JSON.parse(serialized);
	// 	return new this(
	// 		decoded.width,
	// 		decoded.height,
	// 		decoded.cellStates,
	// 		decoded.visibleMatrix
	// 	);
	// }
	//
	// serialize(): string {
	// 	return JSON.stringify({
	// 		id: this.id,
	// 		width: this.width,
	// 		height: this.height,
	// 		cellStates: this._board.cellStates,
	// 		visibleMatrix: this._board.visibleMatrix
	// 	})
	// }

}