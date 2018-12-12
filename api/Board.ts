
import {
	MAX_BOARD_HEIGHT,
	MAX_BOARD_WIDTH,
	MIN_BOARD_HEIGHT,
	MIN_BOARD_WIDTH
} from "./Config";
import {RequestError} from "./RequestError";
import {ServerSideError} from "./ServerSideError";
import {Cell} from "./Cell";

export class Board {

	constructor(readonly width: number,
	            readonly height: number,
	            protected _cells: Array< Array<Cell> >) {

		if (_cells) {
			this._cells = _cells.map( (row: Array<Cell>) => {
				return row.map( (cell: Cell) => {
					return new Cell(cell.hasBomb, cell.visible, cell.neighborBombs, cell.flagged);
				})
			})

		} else {

			/**
			 * These checks are performed only when we are creating a new
			 * board, to allow backwards compatibility in case the limits
			 * are modified.
			 */
			if (!isFinite(width))
				throw new RequestError(`Missing mandatory "width" parameter.`);

			if (!isFinite(height))
				throw new RequestError(`Missing mandatory "height" parameter.`);

			if (this.width < MIN_BOARD_WIDTH)
				throw new RequestError(`Board can't be narrower than ${MIN_BOARD_WIDTH}`);

			if (this.width > MAX_BOARD_WIDTH)
				throw new RequestError(`Board can't be wider than ${MAX_BOARD_WIDTH}`);

			if (this.height < MIN_BOARD_HEIGHT)
				throw new RequestError(`Board can't be shorter than ${MIN_BOARD_HEIGHT}`);

			if (this.height > MAX_BOARD_HEIGHT)
				throw new RequestError(`Board can't be taller than ${MAX_BOARD_HEIGHT}`);

			this._cells = [];

			for (let y = 0; y < height; ++y) {
				let cell_row = [];
				for (let x = 0; x < width; ++x) {
					cell_row.push(new Cell(Math.random() > .7, false, 0, false));
				}
				this._cells.push(cell_row);
			}

			for (let x = width; x--;)
				for (let y = height; y--;)
					this._cells[x][y].neighborBombs =
						(this._hasBombSafe(x+1, y) ? 1 : 0) +
						(this._hasBombSafe(x-1, y) ? 1 : 0) +
						(this._hasBombSafe(x, y+1) ? 1 : 0) +
						(this._hasBombSafe(x, y-1) ? 1 : 0);

		}

	}

	protected _coordsInRange(x: number, y: number): boolean {
		return (x >= 0) &&
			(y >= 0) &&
			(x < this.width) &&
			(y < this.height);
	}

	protected _hasBombSafe(x: number, y: number): boolean {
		return this._coordsInRange(x, y) ?
			this._cells[x][y].hasBomb :
			false;
	}

	protected _spread(x: number, y: number) {

		if (!this._coordsInRange(x, y))
			return;

		let cell = this._cells[x][y];

		if (cell.visible)
			return;

		if (cell.hasBomb)
			return;

		cell.visible = true;

		if (!cell.hasBomb) {
			this._spread(x+1, y);
			this._spread(x-1, y);
			this._spread(x, y+1);
			this._spread(x, y-1);
			return true;
		}

		return false;

	}

	/**
	 * If x or y values are invalid, a RequestError exception is thrown.
	 * @param x
	 * @param y
	 * @private
	 */
	protected _checkCoords(x: number, y: number) {

		if (Math.floor(x) !== x)
			throw new RequestError(`Cell coordinates must be non-negative integers`);

		if (Math.floor(y) !== y)
			throw new RequestError(`Cell coordinates must be non-negative integers`);

		if (x >= this.width)
			throw new RequestError(`'x' coordinate is out of range`);

		if (y >= this.height)
			throw new RequestError(`'y' coordinate is out of range`);

	}

	/**
	 * Process a click on a cell, returning false iff clicked on a bomb,
	 * true otherwise.
	 * @param x
	 * @param y
	 */
	click(x: number, y: number): boolean {

		this._checkCoords(x, y);

		let cell = this._cells[x][y];

		// If it's already visible, no action is required.
		if (cell.visible)
			return;

		cell.visible = true;

		if (cell.hasBomb)
			return false;

		this._spread(x, y);

		return true;

	}

	/**
	 * Turns on/off the flag value of a (hidden) cell.
	 */
	flag(x: number, y: number, newValue: boolean) {

		this._checkCoords(x, y);

		let cell = this._cells[x][y];

		if (cell.visible)
			throw new RequestError(`Cell is already visible`);

		cell.flagged = newValue;

	}

	get cells() { return this._cells }

	publicView(): Array<Array<any>> {
		let retVal: Array<Array<any>> = [];

		for (let x = 0; x < this.width; ++x) {
			let row = [];
			for (let y = 0; y < this.height; ++y) {
				row.push(this._cells[x][y].publicView());
			}
			retVal.push(row);
		}

		return retVal;
	}

}
