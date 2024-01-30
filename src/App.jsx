import Player from "./components/player/player";
import GameBoard from "./components/gameBoard/gameBoard";
import Log from "./components/Log/Log";
import { useState } from "react";
import { WINNING_COMBINATIONS } from "./winning-combinations";
import GameOver from "./components/gamOver/game-over";

const PLAYERS = { X: "player 1", O: "player 2" };

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function driveActivePlayer(gameTurns) {
  let currentPlayer = "X";
  gameTurns.length > 0 && gameTurns[0].player === "X"
    ? (currentPlayer = "O")
    : undefined;
  return currentPlayer;
}

function driveWinner(gameBoard, player) {
  let winner = null;
  for (let combination of WINNING_COMBINATIONS) {
    const firstSquareSymbel =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbel =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbel =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbel &&
      firstSquareSymbel === secondSquareSymbel &&
      firstSquareSymbel === thirdSquareSymbel
    ) {
      winner = player[firstSquareSymbel];
    }
  }
  return winner;
}

function driveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }

  return gameBoard;
}

function App() {
  const [player, setPlayer] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const activePlayer = driveActivePlayer(gameTurns);
  const gameBoard = driveGameBoard(gameTurns);

  function handleRematch() {
    setGameTurns([]);
  }

  const winner = driveWinner(gameBoard, player);

  function handlePplayerNameChange(symbol, newName) {
    setPlayer((prevPlayer) => {
      return {
        ...prevPlayer,
        [symbol]: newName,
      };
    });
  }

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      let currentPlayer = driveActivePlayer(prevTurns);

      const updatedTurns = [
        {
          square: { row: rowIndex, col: colIndex },
          player: currentPlayer,
        },
        ...prevTurns,
      ];
      return updatedTurns;
    });
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePplayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePplayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRematch={handleRematch} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
