
import * as $ from "jquery";

class API {

	static getGame() {
		return $.getJSON('http://localhost:3088/game')
	}

	static createGame(newGame) {
		return $.post('http://localhost:3088/game', newGame)
	}

}

export default API;
