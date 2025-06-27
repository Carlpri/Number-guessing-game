import { useReducer } from "react";
import "./App.css";

function generateSecretNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function gameReducer(state, action) {
  if (action.type === "NEW_GAME") {
    return {
      ...state,
      newGameBtnDisabled: true,
      inputReadOnly: false,
      guessBtnDisabled: false,
      feedback: "Secret number generated, try guessing it!",
      numTrials: 10,
      secretNumber: generateSecretNumber(),
      playerGuess: "",
    };
  }
  if (action.type === "SET_PLAYER_GUESS") {
    return {
      ...state,
      playerGuess: action.payload,
    };
  }

  if (action.type === "MAKE_GUESS") {
    const guess = action.payload;
    let feedback = "";
    let numTrials = state.numTrials - 1;

    if (guess < 1 || guess > 100 || isNaN(guess)) {
      feedback = "Please enter a valid number between 1 and 100.";
      return {
        ...state,
        feedback,
      };
    }

    if (guess === state.secretNumber) {
      feedback = "Congratulations! You won this time!";
      return {
        ...state,
        feedback,
        numTrials,
        newGameBtnDisabled: false,
        inputReadOnly: true,
        guessBtnDisabled: true,
      };
    }

    if (numTrials <= 0) {
      feedback = "Game Over boss! You have 0 trials left.";
      return {
        ...state,
        feedback,
        numTrials,
        newGameBtnDisabled: false,
        inputReadOnly: true,
        guessBtnDisabled: true,
      };
    }
    if (guess < state.secretNumber) {
      feedback = `${guess} is too low, kindly try again.`;
    } else {
      feedback = `${guess} is too high, kindly try again.`;
    }

    return {
      ...state,
      feedback,
      numTrials,
    };
  }
  return state;
}

function Game() {
  const [state, dispatch] = useReducer(gameReducer, {
    newGameBtnDisabled: false,
    inputReadOnly: true,
    guessBtnDisabled: true,
    feedback: null,
    numTrials: 10,
    secretNumber: null,
    playerGuess: "",
  });

  const handleGuess = (e) => {
    e.preventDefault();
    dispatch({ type: "MAKE_GUESS", payload: parseInt(state.playerGuess, 10) });
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <h2 className="game-main-instruction">
          Guess a number between 1 and 100
        </h2>
        <button
          className="new-game-btn"
          onClick={() => dispatch({ type: "NEW_GAME" })}
          disabled={state.newGameBtnDisabled}
        >
          New Game
        </button>
      </header>

      <form className="game-form" onSubmit={handleGuess}>
        <h2 className="trials-count-game-guide">
          {state.numTrials} Trials remaining
        </h2>
        <input
          className="input"
          type="number"
          placeholder="00"
          readOnly={state.inputReadOnly}
          value={state.playerGuess}
          onChange={(e) =>
            dispatch({ type: "SET_PLAYER_GUESS", payload: e.target.value })
          }
        />

        {state.feedback && (
          <h2 className="game-result game-guide">{state.feedback}</h2>
        )}

        <button
          className="guess-btn"
          type="submit"
          disabled={state.guessBtnDisabled}
        >
          Guess
        </button>
      </form>
    </div>
  );
}

export default Game;
