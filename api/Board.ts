
import {
	MAX_BOARD_HEIGHT,
	MAX_BOARD_WIDTH,
	MIN_BOARD_HEIGHT,
	MIN_BOARD_WIDTH
} from "./Config";
import {RequestError} from "./RequestError";
import {ServerSideError} from "./ServerSideError";
import {Cell} from "./Cell";

/**
 * The board is represented as an array of rows, from top to bottom, left to
 * right.
 */
export class Board {

	constructor(readonly width: number,
	            readonly height: number,
	            readonly mines: number,
	            protected _cells: Array< Array<Cell> >) {

		if (_cells) {
			this._cells = _cells.map( (row: Array<Cell>) => {
				return row.map( (cell: Cell) => {
					return new Cell(cell.hasMine, cell.visible, cell.neighborMines, cell.flagged);
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
					cell_row.push(new Cell(false, false, 0, false));
				}
				this._cells.push(cell_row);
			}

			for (let imine = this.mines; imine--;) {
				while (true) {
					let x = Math.floor(Math.random() * this.width);
					let y = Math.floor(Math.random() * this.height);
					// Although not possible as stated by Math.random specs,
					// we'd rather catch edge cases bugs.
					if (x === this.width)
						continue;
					if (y === this.height)
						continue;

					if (this._cells[y][x].hasMine)
						continue;

					this._cells[y][x].hasMine = true;
					break;
				}
			}

			for (let x = width; x--;)
				for (let y = height; y--;)
					this._cells[y][x].neighborMines =
						(this._hasBombSafe(x+1, y) ? 1 : 0) +
						(this._hasBombSafe(x-1, y) ? 1 : 0) +
						(this._hasBombSafe(x, y+1) ? 1 : 0) +
						(this._hasBombSafe(x, y-1) ? 1 : 0);

		}

	}

	public won(): boolean {

		let flaggedc = 0;

		for (let x = this.width; x--;) {
			for (let y = this.height; y--;) {
				if (this._cells[y][x].flagged) {
					flaggedc++;
				}
			}
		}

		return flaggedc === this.mines;

	}

	protected _coordsInRange(x: number, y: number): boolean {
		return (x >= 0) &&
			(y >= 0) &&
			(x < this.width) &&
			(y < this.height);
	}

	protected _hasBombSafe(x: number, y: number): boolean {
		return this._coordsInRange(x, y) ?
			this._cells[y][x].hasMine :
			false;
	}

	protected _spread_neighbors(x: number, y: number) {
		this._spread(x+1, y);
		this._spread(x-1, y);
		this._spread(x, y+1);
		this._spread(x, y-1);
	}

	protected _spread(x: number, y: number) {

		if (!this._coordsInRange(x, y))
			return;

		let cell = this._cells[y][x];

		if (cell.visible)
			return;

		if (cell.hasMine)
			return;

		cell.visible = true;

		this._spread_neighbors(x, y)

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

		let cell = this._cells[y][x];

		// If it's already visible, no action is required.
		if (cell.visible)
			return;

		cell.visible = true;

		if (cell.hasMine)
			return false;

		this._spread_neighbors(x, y);

		return true;

	}

	/**
	 * Turns on/off the flag value of a (hidden) cell.
	 */
	flag(x: number, y: number, newValue: boolean) {

		this._checkCoords(x, y);

		let cell = this._cells[y][x];

		if (cell.visible)
			throw new RequestError(`Cell is already visible`);

		cell.flagged = newValue;

	}

	get cells() { return this._cells }

	publicView(): Array<Array<any>> {

		return this._cells.map( (row: Array<Cell>) => {
			return row.map( (cell: Cell) => {
				return cell.publicView();
			})
		})

	}

}
