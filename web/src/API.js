
import * as $ from "jquery";
import * as Cookie from 'js-cookie';

class API {

	static getGame() {
		return $.ajax({
			url: 'http://localhost:3088/game',
			xhrFields: {
				withCredentials: true
			}
		})
	}

	static createGame(newGame) {
		return $.ajax({
			url: 'http://localhost:3088/game',
			method: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: newGame
		})
	}

	static click(row, column) {
		return $.ajax({
			url: 'http://localhost:3088/click',
			method: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				x: column,
				y: row
			}
		})
	}

	static flag(row, column, flagged) {
		return $.ajax({
			url: 'http://localhost:3088/flag',
			method: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				x: column,
				y: row,
				flagged: 0+flagged
			}
		})
	}

	static resetGame() {
		Cookie.remove('mineSweeper');
	}

}

export default API;
