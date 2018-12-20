
export class Cell {

	constructor(public hasMine: boolean,
	            public visible: boolean,
	            public neighborMines: number,
	            public flagged: boolean) {

	}

	publicView(): Array<any> {
		return [
			( this.visible ? 'v' : '' ) +
			( this.flagged ? 'f' : '' ) +
			( this.visible && this.hasMine ? 'm' : ''),
			this.neighborMines
		];
	}

}