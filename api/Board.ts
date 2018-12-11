import {CellState} from "./CellState";
import {
	MAX_BOARD_HEIGHT,
	MAX_BOARD_WIDTH,
	MIN_BOARD_HEIGHT,
	MIN_BOARD_WIDTH
} from "./Config";
import {RequestError} from "./RequestError";
import {ServerSideError} from "./ServerSideError";

export class Board {

	constructor(readonly width: number,
	            readonly height: number,
	            protected _cellStates?: Array< Array<CellState> >,
	            protected _visibleMatrix?: Array< Array< boolean> >,
	            protected _flagMatrix?: Array< Array<boolean> >) {

		if (!_cellStates) {
			if (_visibleMatrix)
				throw new ServerSideError(`A Board can't be created without state but visibility matrix`);

			/**
			 * These checks are performed only when we are creating a new
			 * board, to allow backwards compatibility in case the limits
			 * are modified.
			 */
			if (this.width < MIN_BOARD_WIDTH)
				throw new RequestError(`Board can't be narrower than ${MIN_BOARD_WIDTH}`);

			if (this.width > MAX_BOARD_WIDTH)
				throw new RequestError(`Board can't be wider than ${MAX_BOARD_WIDTH}`);

			if (this.height < MIN_BOARD_HEIGHT)
				throw new RequestError(`Board can't be shorter than ${MIN_BOARD_HEIGHT}`);

			if (this.height > MAX_BOARD_HEIGHT)
				throw new RequestError(`Board can't be taller than ${MAX_BOARD_HEIGHT}`);

			this._cellStates = [];
			this._visibleMatrix = [];
			this._flagMatrix = [];

			for (let y = 0; y < height; ++y) {
				let board_row = [];
				let visible_row = [];
				let flag_row = [];
				for (let x = 0; x < width; ++x) {
					board_row.push(Math.random() > .7 ? CellState.Bomb : CellState.Empty);
					visible_row.push(false);
					flag_row.push(false);
				}
				this._cellStates.push(board_row);
				this._visibleMatrix.push(visible_row);
				this._flagMatrix.push(flag_row);
			}
		}

	}

	protected _spread(x: number, y: number) {

		if (
			(x < 0) ||
			(y < 0) ||
			(x >= this.width) ||
			(y >= this.height)
		)
			return;

		if (this._visibleMatrix[x][y])
			return;

		this._visibleMatrix[x][y] = true;

		switch (this._cellStates[x][y]) {
			case CellState.Empty:
				this._spread(x+1, y);
				this._spread(x-1, y);
				this._spread(x, y+1);
				this._spread(x, y-1);
				return true;

			case CellState.Bomb:
				return false;

			default:
				throw new Error(`Internal state corruption`);
		}

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

		// If it's already visible, no action is required.
		if (this._visibleMatrix[x][y])
			return;

		this._visibleMatrix[x][y] = true;

		switch (this._cellStates[x][y]) {
			case CellState.Empty:
				this._spread(x, y);
				return true;

			case CellState.Bomb:
				return false;

			default:
				throw new ServerSideError(`Internal state corruption, please start a new game`);
		}
	}

	/**
	 * Turns on/off the flag value of a (hidden) cell.
	 */
	flag(x: number, y: number, newValue: boolean) {

		this._checkCoords(x, y);

		if (this._visibleMatrix[x][y])
			throw new RequestError(`Cell is already visible`);

		this._flagMatrix[x][y] = newValue;

	}

	get cellStates() { return this._cellStates }
	get visibleMatrix() { return this._visibleMatrix }
	get flagMatrix() { return this._flagMatrix }

}
