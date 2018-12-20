
import React from 'react';
import './NewGameForm.css';

class NewGameForm extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			newGame: {
				width: 5,
				height: 5,
				mines: 5
			}
		}
	}

	handleNewGameWidthChange(event) {
		event.persist();
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
		event.persist();
		this.setState( (prevState, props) => {
			return {
				newGame: {
					...prevState.newGame,
					height: event.target.value
				}
			}
		})
	}

	handleNewGameMinesChange(event) {
		event.persist();
		this.setState( (prevState, props) => {
			return {
				newGame: {
					...prevState.newGame,
					mines: event.target.value
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
						<label htmlFor={"new-game-mines"}>Mines</label>
						<input type={"number"} defaultValue={5}
							   id={"new-game-mines"}
							   onChange={this.handleNewGameMinesChange.bind(this)}
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
