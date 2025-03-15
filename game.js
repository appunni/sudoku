class SudokuGame {
    constructor() {
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = [];
        this.initialBoard = [];
    }

    generatePuzzle() {
        // Start with an empty board
        this.board = Array(9).fill().map(() => Array(9).fill(0));

        // Fill in the diagonal 3x3 boxes first (they're independent)
        for (let i = 0; i < 9; i += 3) {
            this.fillBox(i, i);
        }

        // Fill the rest of the board
        this.solveSudoku(this.board);

        // Save the solution
        this.solution = this.board.map(row => [...row]);

        // Remove numbers to create the puzzle
        this.createPuzzle();

        // Save the initial board state
        this.initialBoard = this.board.map(row => [...row]);

        return this.board;
    }

    fillBox(row, col) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                this.board[row + i][col + j] = numbers[randomIndex];
                numbers.splice(randomIndex, 1);
            }
        }
    }

    solveSudoku(board) {
        const emptyCell = this.findEmptyCell(board);
        if (!emptyCell) return true;

        const [row, col] = emptyCell;
        for (let num = 1; num <= 9; num++) {
            if (this.isValidMove(row, col, num)) {
                board[row][col] = num;
                if (this.solveSudoku(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    }

    createPuzzle() {
        // Remove numbers while maintaining unique solution
        const cellsToRemove = 40; // Adjust for difficulty
        let count = 0;

        while (count < cellsToRemove) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);

            if (this.board[row][col] !== 0) {
                const temp = this.board[row][col];
                this.board[row][col] = 0;
                count++;
            }
        }
    }

    findEmptyCell(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return [row, col];
            }
        }
        return null;
    }

    isValidMove(row, col, num) {
        return this.isValidPlacement(row, col, num);
    }

    isValidPlacement(row, col, num) {
        // Save current value
        const currentValue = this.board[row][col];

        // Temporarily remove current value for validation
        this.board[row][col] = 0;

        // Check row
        for (let x = 0; x < 9; x++) {
            if (this.board[row][x] === num) {
                this.board[row][col] = currentValue;
                return false;
            }
        }

        // Check column
        for (let x = 0; x < 9; x++) {
            if (this.board[x][col] === num) {
                this.board[row][col] = currentValue;
                return false;
            }
        }

        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[boxRow + i][boxCol + j] === num) {
                    this.board[row][col] = currentValue;
                    return false;
                }
            }
        }

        // Restore current value
        this.board[row][col] = currentValue;
        return true;
    }

    checkWin() {
        // Check if current board matches solution
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    isInitialNumber(row, col) {
        return this.initialBoard[row][col] !== 0;
    }

    setNumber(row, col, num) {
        if (!this.isInitialNumber(row, col)) {
            this.board[row][col] = num;
            return true;
        }
        return false;
    }

    clearNumber(row, col) {
        if (!this.isInitialNumber(row, col)) {
            this.board[row][col] = 0;
            return true;
        }
        return false;
    }

    getNextMove() {
        // Find first empty or incorrect cell
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] !== this.solution[row][col]) {
                    return {
                        row,
                        col,
                        value: this.solution[row][col]
                    };
                }
            }
        }
        return null;
    }

    autoSolve() {
        const move = this.getNextMove();
        if (move) {
            this.board[move.row][move.col] = move.value;
        }
        return move;
    }
}
