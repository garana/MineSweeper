
import {Board} from "./Board";
import {Cell} from "./Cell";

export class Game {

	protected _board: Board;

	constructor(
		readonly width: number,
		readonly height: number,
		_board?: Array< Array<Cell> >) {

		this._board = new Board(width, height, _board);
	}

	get board(): Board { return this._board }

	toJSON() {
		return {
			width: this.width,
			height: this.height,
			cells: this._board.cells
		}
	}

	static fromJSON(json: string): Game {
		let js = JSON.parse(json);
		return new this(
			js.width,
			js.height,
			js.cells
		)
	}

	publicView(): any {
		return {
			width: this.width,
			height: this.height,
			board: this.board.publicView()
		}
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