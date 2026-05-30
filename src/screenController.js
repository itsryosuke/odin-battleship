import { gameController } from "./gameController.js";
export { screenController };

function screenController() {
    const game = gameController();
    const display = document.querySelector("#display");
    const playerBoardDiv = document.querySelector("#player_board");
    const computerBoardDiv = document.querySelector("#computer_board");
    const restartButton = document.querySelector("#restart_button");

    function updateScreen() {
        playerBoardDiv.textContent = "";
        computerBoardDiv.textContent = "";
        const playerBoard = game.getPlayers()[0].gameBoard;
        const computerBoard = game.getPlayers()[1].gameBoard;
        const playerShipCoords = [];
        playerBoard.ships.forEach(ship => {
            playerShipCoords.push(...ship.coords);
        });
        display.textContent = game.getDisplayMessage();

        function checkInclusion(array, coords) {
            for (let i = 0; i < array.length; i++) {
                let current = array[i];
                if (current[0] === coords[0] && current[1] === coords[1]) return true
            }
            return false
        }

        for (let i = 9; i > -1; i--) {
            for (let j = 0; j < 10; j++) {
                const cellButton = document.createElement("button");
                cellButton.classList.add("board_cell");
                cellButton.dataset.coords = [i, j];
                if (checkInclusion(playerBoard.missed, [i, j])) {
                    cellButton.classList.add("missed");
                }
                if (checkInclusion(playerBoard.hits, [i, j])) {
                    cellButton.classList.add("hit");
                }
                else if (checkInclusion(playerShipCoords, [i, j])) {
                    cellButton.classList.add("ship");
                }
                playerBoardDiv.appendChild(cellButton);
            }
        }
        for (let i = 9; i > -1; i--) {
            for (let j = 0; j < 10; j++) {
                const cellButton = document.createElement("button");
                cellButton.classList.add("board_cell");
                cellButton.dataset.coords = [i, j];
                if (checkInclusion(computerBoard.missed, [i, j])) {
                    cellButton.classList.add("missed");
                }
                if (checkInclusion(computerBoard.hits, [i, j])) {
                    cellButton.classList.add("hit");
                }
                computerBoardDiv.appendChild(cellButton);
            }
        }
    }

    restartButton.addEventListener("click", restartGame);

    function clickHandlerBoard(e) {
        computerBoardDiv.removeEventListener("click", clickHandlerBoard);
        let coords = e.target.dataset.coords;
        if (!coords) return;
        coords = coords.split(",").map(Number);
        if (game.playRound(coords)) {
            updateScreen();
            return
        }
        updateScreen();
        setTimeout(() => {
            let gameOver = game.computerPlay();
            updateScreen();
            if (!gameOver) { computerBoardDiv.addEventListener("click", clickHandlerBoard) };
        }, 600);
    }

    function restartGame() {
        game.restartGame();
        updateScreen();
        computerBoardDiv.addEventListener("click", clickHandlerBoard);
    }
    updateScreen();
}