const prompt = require('prompt-sync')({ sigint: true });

// Game symbol
const HAT = '^';
const HOLE = 'O';
const GRASS = '░';
const PLAYER = '*';

/* Constants Game Scenarios (Messages) */
const WIN = "Congratulations! You win!"; //win
const LOSE = "You lose!"; //LOSE
const OUT_BOUND = "You are out of bounds."; //Out-of-bounds
const INTO_HOLE = "You fell into a hole."; // fell-into-hole
const WELCOME = "Welcome to Find My Hat! * U & ^ HAT"; 
const DIRECTION = "Which direction, up(u), down(d), left(l), right(r)?"; // player direction
const QUIT = "Press q or Q to quit game."; //quit
const END_GAME = "Game ended. Thank you."; //end game
const NOT_RECOGNISED = "Input not recognised."; //input not recognised

class Field {
    constructor(rows, cols) {        // constructor
        this.rows = rows;   // row property for field
        this.cols = cols;   // cols property for cols
        this.field = new Array(rows).fill(null).map(() => new Array(cols)); // property that represents field for game
        this.playerPos = { row: 0, col: 0 }; // Initial player position
        this.gamePlay = false; // porperty to set-up the game play
    }

    static welcomeMsg(msg) {                    // methods
        console.log(
            "\n**********************************************\n" +
            msg +
            "\n**********************************************\n"
        );
    }

    // TODO where do we randomise the field with hat, hole and grass
    // TODO the number of holes created should provide sufficient challenge for the game
    // TODO the holes should not block the player from moving at the start of the game
    // Create safezone for player first position and unblocked

    // Generate the field with random placements of holes, grass, and the hat
    generateField() {
        for (let i = 0; i < this.rows; i++) {       // generate field rows
            for (let j = 0; j < this.cols; j++) {   // generate field cols
                // Randomly place HOLE or GRASS
                this.field[i][j] = Math.random() > 0.2 ? GRASS : HOLE;
                // Math.random(): Generates a number between 0 and 1
                // > 0.2: 80% chance for GRASS (░), 20% for HOLE (O)
                /* ? GRASS : HOLE: Chooses GRASS if true, otherwise HOLE */
            }
        }

        // Place the hat in a random position that is not the starting position
        let hatPlaced = false;
        while (!hatPlaced) {
            const hatRow = Math.floor(Math.random() * this.rows); // hatRow r chosen randomly
            const hatCol = Math.floor(Math.random() * this.cols); // hatCol r chosen randomly
            if (this.field[hatRow][hatCol] === GRASS) {
                this.field[hatRow][hatCol] = HAT;
                hatPlaced = true; // make sure selected position for grass and hole not the start position for player
            }
        }
    }

    printField() {
        this.field.forEach((element) => {
            console.log(element.join(""));
        });
    }

    startGame() {
        this.gamePlay = true;
        this.generateField();

        // Ensure the starting position is safe and unblock, so that player can move from start point
        this.field[0][0] = PLAYER; // init Player start position
        const safeZone = [         // ! SAFEZONE
            [0, 1],
            [1, 0],
            [1, 1],
        ];
        for (const [rowOffset, colOffset] of safeZone) { // for loop ensures positions set within safeZone r set to grass and within field bounds
            if (rowOffset < this.rows && colOffset < this.cols) {
                this.field[rowOffset][colOffset] = GRASS; // Make adjacent positions safe
            }
        }

        this.updateGame();
    }

    updateGame() {
        let userInput = "";

        do {
            this.printField();
            console.log(DIRECTION.concat(" ", QUIT)); // Request player input
            userInput = prompt(); // Get user input

            switch (userInput.toLowerCase()) { // player's input for movement using keyboard
                case "u": // go up
                case "d": // go down
                case "l": // go left
                case "r": // go right
                    this.updatePlayer(userInput.toLowerCase());
                    break;

                case "q": // q or Q for quit the game
                    this.endGame();
                    break;

                default: /* (any other item choice not recognised) */
                    console.log(NOT_RECOGNISED);
                    break;
            }
        } while (this.gamePlay);
    }

    endGame() {
        console.log(END_GAME);
        process.exit();
    }

        // TODO for the Assessment
        // TODO update the players position in the field
        // TODO then check if the player had fallen into hole - if yes(LOSE), endGame()
        // TODO then check if the player has gotten out of bounds - if yes(LOSE), endGame()
        // TODO then check if the player hads found the hat - if yes(WIN), endGame()
    
    updatePlayer(direction) {
        const { row, col } = this.playerPos;
        let newRow = row;
        let newCol = col;

        // Update position based on direction, player movement
        if (direction === "u") newRow -= 1;  // go up
        if (direction === "d") newRow += 1;  // go down
        if (direction === "l") newCol -= 1;  // go left
        if (direction === "r") newCol += 1;  // go right

        // Check if out of bounds
        // This condition checks if newRow or newCol are outside the valid range of the grid's rows and columns. If either is out of bounds, the condition is true.
        if (newRow < 0 || newRow >= this.rows || newCol < 0 || newCol >= this.cols) {
            console.log(OUT_BOUND); // out of bound n lose
            console.log(LOSE);
            this.gamePlay = false;
            return;
        }

        // Update player position
        const newPosition = this.field[newRow][newCol];
        if (newPosition === HAT) {  // until Hat is found
            console.log(WIN);
            this.gamePlay = false;
        } else if (newPosition === HOLE) {
            console.log(INTO_HOLE); // fell into hole and lose
            console.log(LOSE);
            this.gamePlay = false;
        } else {
            // Update field to reflect player's move
            this.field[row][col] = GRASS; // Replace old position with grass
            this.field[newRow][newCol] = PLAYER; // Set new position as player
            this.playerPos = { row: newRow, col: newCol };
        }
    }
}

// Static method to welcome the player
Field.welcomeMsg(WELCOME); // welcome message

const ROWS = 10; // declare initial rows
const COLS = 10; // declare initial colums
const field = new Field(ROWS, COLS); // Declare and create instance of Field class
field.startGame(); // start
