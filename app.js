const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        board[index] = marker;
    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    return { getBoard, updateBoard, resetBoard };
})();

const Player = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
};

const Game = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let gameEnded = false;

    const resetBoard = () => {
        Gameboard.resetBoard();
    }

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
        gameEnded = false;
        resetBoard();
        renderBoard();
        displayTurn();
    };

    const playTurn = (index) => {
        if (gameEnded) return;
        const marker = currentPlayer.getMarker();
        Gameboard.updateBoard(index, marker);
        renderBoard();
        if (checkWin()) {
            endGame(`${currentPlayer.getName()} wins!`);
        } else if (checkDraw()) {
            endGame("It's a draw!");
        } else {
            switchPlayer();
            displayTurn();
            if (currentPlayer === player2 && player2.getName() == "Computer") {
                setTimeout(() => {
                    playComputerTurn();
                }, 1000);
            }

        }
    };

    const playComputerTurn = () => {
        const board = Gameboard.getBoard();
        const emptyCells = board.reduce((acc, cell, index) => {
            if (cell === "") {
                acc.push(index);
            }
            return acc;
        }, []);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const index = emptyCells[randomIndex];
        playTurn(index);
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c] = winConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    };

    const checkDraw = () => {
        const board = Gameboard.getBoard();
        return board.every((cell) => cell !== "");
    };

    const endGame = (message) => {
        gameEnded = true;
        const turnDisplay = document.getElementById("turn-display");
        const resetButton = document.getElementById("restart-button");
        resetButton.style.display = "flex";
        turnDisplay.textContent = `${message}`;;
    };

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        for (let i = 0; i < board.length; i++) {
            const cell = document.getElementById(i);
            cell.textContent = board[i];
        }
    };

    const displayTurn = () => {
        const turnDisplay = document.getElementById("turn-display");
        turnDisplay.textContent = `${currentPlayer.getName()}'s turn`;
    };

    const restartButton = document.getElementById("restart-button");
    restartButton.addEventListener("click", () => {
        Game.resetBoard();
        startGame(player1.getName(), player2.getName());
    });

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.addEventListener("click", () => {
            const index = cell.getAttribute("data-index");
            Game.playTurn(index);
        });
    });

    const showGameBoard = () => {
        const gameBoard = document.getElementById("board");
        const modeSelect = document.getElementById("mode-selection");
        const changeMode = document.getElementById("change-mode");
        const turnDisplay = document.getElementById("turn-display");
        gameBoard.style.display = "flex";
        modeSelect.style.display = "none";
        changeMode.style.display = "flex";
        turnDisplay.style.display = "flex";
    };

    const hideGameBoard = () => {
        const modeSelect = document.getElementById("mode-selection");
        const gameBoard = document.getElementById("board");
        const resetButton = document.getElementById("restart-button");
        const changeMode = document.getElementById("change-mode");
        const turnDisplay = document.getElementById("turn-display");
        resetButton.style.display = "none";
        changeMode.style.display = "none";
        modeSelect.style.display = "flex";
        gameBoard.style.display = "none";
        turnDisplay.style.display = "none";
    };

    const humanButton = document.querySelector("#two-player-btn");
    humanButton.addEventListener("click", () => {
        const name1 = 'player 1';
        const name2 = 'player 2';
        showGameBoard();
        Game.startGame(name1, name2);

    });

    const aiButton = document.querySelector("#ai-player-btn");
    aiButton.addEventListener("click", () => {
        const name1 = "player 1";
        const name2 = "Computer";
        showGameBoard();
        Game.startGame(name1, name2);

    });

    const changeButton = document.querySelector("#change-mode");
    changeButton.addEventListener("click", () => {

        hideGameBoard();
    });

    return { startGame, playTurn, resetBoard };
})();



