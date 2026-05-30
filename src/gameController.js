import { Player } from "./battleship.js";
export { gameController };

function gameController() {
    const players = [];
    players.push(new Player("Player"), new Player("Computer"));

    let activePlayer = players[0];
    let attackedPlayer = players[1];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const switchAttackedPlayer = () => {
        attackedPlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    let gameOver = false;

    const getPlayers = () => players;

    let displayMessage = "Place your ships!";

    const getDisplayMessage = () => displayMessage;

    let computerMoves = generateComputerMoves();

    const playRound = (coords) => {
        attackedPlayer.gameBoard.recieveAttack(coords);
        gameOver = attackedPlayer.gameBoard.checkGameOver();
        if (gameOver === true) {
            displayMessage = `${attackedPlayer.name}'s fleet got destroyed!`;
            return gameOver
        }
        switchPlayerTurn();
        displayMessage = `${activePlayer.name}'s turn...`;
        switchAttackedPlayer();
    };

    const restartGame = () => {
        players.length = 0;
        players.push(new Player("Player"), new Player("Computer"));
        placeShipsRandom(players[0]);
        placeShipsRandom(players[1]);
        activePlayer = players[0];
        attackedPlayer = players[1];
        gameOver = false;
        computerMoves = generateComputerMoves();
        displayMessage = "Start shooting!"
    }

    function generateComputerMoves() {
        let array = [];
        for (let i = 9; i > -1; i--) {
            for (let j = 0; j < 10; j++) {
                array.push([i, j])
            }
        }
        return array
    }

    function getComputerMove() {
        let index = Math.floor(Math.random() * computerMoves.length);
        let move = computerMoves[index];
        computerMoves.splice(index, 1);
        return move
    }

    function randomizePosition(length) {
        let coords = [];
        let index1 = Math.floor(Math.random() * 9);
        let index2 = Math.floor(Math.random() * 9);
        let startingPosition = [index1, index2];
        coords.push(startingPosition);
        if (index1 + (length - 1) <= 9) {
            for (let i = 1; i < length; i++) {
                coords.push([index1 + i, index2])
            }
        }
        else if (index2 + (length - 1) <= 9) {
            for (let i = 1; i < length; i++) {
                coords.push([index1, index2 + i])
            }
        }
        else if (index1 - (length - 1) >= 0) {
            for (let i = 1; i < length; i++) {
                coords.push([index1 - i, index2])
            }
        }
        else if (index2 - (length - 1) >= 0) {
            for (let i = 1; i < length; i++) {
                coords.push([index1, index2 - i])
            }
        }
        return coords
    }

    function placeShipsRandom(player) {
        let lengths = [2, 3, 3, 4, 5]
        while (!(lengths.length === 0)) {
            let current = lengths.pop();
            let coords = randomizePosition(current);
            while (!player.gameBoard.isValidPosition(coords)) {
                coords = randomizePosition(current);
            }
            player.gameBoard.placeShip(current, coords);
        }
    }

    const computerPlay = () => {
        playRound(getComputerMove());
    }

    return { getPlayers, getDisplayMessage, playRound, restartGame, computerPlay }
}