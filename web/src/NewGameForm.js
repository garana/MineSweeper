
import React, { Component } from 'react';
import './NewGameForm.css';

class NewGameForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			newGame: {
				width: 5,
				height: 5,
				bombs: 5
			}
		}
	}

	handleNewGameWidthChange(event) {
		this.setState( (prevState, props) => {
			return {
				newGame: {
					...prevState.newGame,
					width: event.target.value
				}
			}
		})
	}

	handleNewGameHeightChange(event) {
		this.setState( (prevState, props) => {
			return {
				newGame: {
					...prevState.newGame,
					height: event.target.value
				}
			}
		})
	}

	handleNewGameBombsChange(event) {
		this.setState( (prevState, props) => {
			return {
				newGame: {
					...prevState.newGame,
					bombs: event.target.value
				}
			}
		})
	}

	createNewGame() {
		let newGame = this.state.newGame;

		this.props.createNewGame(newGame)
	}

	render() {

		return (
			<div className={"new-game"}>
				<form
					layout={"inline"}
					onSubmit={this.createNewGame.bind(this)}
				>
					<div className={"new-game-input"}>
						<label htmlFor={"new-game-width"}>Width</label>
						<input type={"number"} defaultValue={5}
							   id={"new-game-width"}
							   onChange={this.handleNewGameWidthChange.bind(this)}
							   style={ { width: '4em', textAlign: 'right' } }
						/>
					</div>

					<div className={"new-game-input"}>
						<label htmlFor={"new-game-height"}>Height</label>
						<input type={"number"} defaultValue={5}
							   id={"new-game-height"}
							   onChange={this.handleNewGameHeightChange.bind(this)}
							   style={ { width: '4em', textAlign: 'right' } }
						/>
					</div>

					<div className={"new-game-input"}>
						<label htmlFor={"new-game-bombs"}>Bombs</label>
						<input type={"number"} defaultValue={5}
							   id={"new-game-bombs"}
							   onChange={this.handleNewGameBombsChange.bind(this)}
							   style={ { width: '4em', textAlign: 'right' } }
						/>
					</div>

					<div className={"new-game-button"}>
						<button type={"button"} onClick={this.createNewGame.bind(this)}>
							Create
						</button>
					</div>

				</form>
			</div>
		)
	}

}

export default NewGameForm;
