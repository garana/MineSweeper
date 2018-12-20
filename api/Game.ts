
import {Board} from "./Board";
import {Cell} from "./Cell";

export class Game {

	protected _board: Board;

	constructor(
		readonly width: number,
		readonly height: number,
		readonly mines: number,
		protected _lost: boolean,
		_board?: Array< Array<Cell> >) {

		this._board = new Board(width, height, mines, _board);
	}

	get board(): Board { return this._board }

	get lost(): boolean { return this._lost }

	won(): boolean {
		return this._board.won();
	}

	toJSON() {
		return {
			width: this.width,
			height: this.height,
			mines: this.mines,
			lost: this.lost,
			won: this.won(),
			cells: this._board.cells
		}
	}

	static fromJSON(json: string): Game {
		let js = JSON.parse(json);
		return new this(
			js.width,
			js.height,
			js.mines,
			js.lost,
			js.cells
		)
	}

	click(x: number, y: number) {
		if (!this.board.click(x, y)) {
			/* He clicked on a mine */
			this._lost = true;
		}
	}

	flag(x: number, y: number, flagged: boolean) {
		this.board.flag(x, y, !!flagged);
	}

	publicView(): any {
		return {
			width: this.width,
			height: this.height,
			mines: this.mines,
			lost: this.lost,
			won: this.won(),
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