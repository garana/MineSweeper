
export class Cell {

	constructor(readonly hasBomb: boolean,
	            public visible: boolean,
	            public neighborBombs: number,
	            public flagged: boolean) {

	}

	publicView(): Array<any> {
		return [
			( this.visible ? 'v' : '' ) +
			( this.flagged ? 'f' : '' ),
			this.neighborBombs
		];
	}

}