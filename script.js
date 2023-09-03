// Get references to the HTML elements
var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');

// Define constants for player names, scores, and rod titles
const PLAYER_NAME = "PlayerName";
const PLAYER_SCORE = "PlayerMaxScore";
const ROD_TITLE_1 = "Rod 1";
const ROD_TITLE_2 = "Rod 2";

// Declare variables for game state and ball movement
let score = 0,
    maxScore = 0,
    ballSpeedX = 2,
    ballSpeedY = 2,
    gameStarted = false,
    selectedRod = ROD_TITLE_1,
    ballMovement;

// Getting the window dimensions
let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;

// Initialize the game
(function () {
    // Get the selected rod and max score from local storage
    selectedRod = localStorage.getItem(PLAYER_NAME);
    maxScore = localStorage.getItem(PLAYER_SCORE);

    // If no data is found, show a welcome message and initialize the values
    if (selectedRod === null || maxScore === null) {
        alert("Welcome to Ping Pong! This is your first time playing. Let's begin!");
        maxScore = 0;
        selectedRod = ROD_TITLE_1;
    } else {
        // Show the highest score if data is available
        alert(selectedRod + " has the highest score of " + maxScore * 100);
    }

    // Reset the game board
    resetGame(selectedRod);
})();

// Function to reset the game board
function resetGame(rodName) {
    // Center the rods and ball horizontally
    rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
    rod2.style.left = rod1.style.left;
    ball.style.left = (windowWidth - ball.offsetWidth) / 2 + 'px';

    // Position the ball based on the selected rod
    if (rodName === ROD_TITLE_2) {
        ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
        ballSpeedY = 2;
    } else if (rodName === ROD_TITLE_1) {
        ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
        ballSpeedY = -2;
    }

    // Reset the score and game state
    score = 0;
    gameStarted = false;
}

// Function to store the winner and update the score
function storeWinner(rod, playerScore) {
    // Update the max score and player name in local storage
    if (playerScore > maxScore) {
        maxScore = playerScore;
        localStorage.setItem(PLAYER_NAME, rod);
        localStorage.setItem(PLAYER_SCORE, maxScore);
    }

    // Stop the ball movement and reset the game board
    clearInterval(ballMovement);
    resetGame(rod);

    // Show the winning message with the score
    alert(rod + " wins with a score of " + (playerScore * 100) + ". The highest score is: " + (maxScore * 100));
}

// Function to move the rod based on keyboard input
function moveRod(event) {
    if (!gameStarted) {
        return;
    }

    let rodSpeed = 20;
    let rodRect = rod1.getBoundingClientRect();

    // Move the rod based on arrow keys or 'A' and 'D' keys
    if ((event.code === "KeyD" || event.code === "ArrowRight") && (rodRect.right < window.innerWidth)) {
        rod1.style.left = (rodRect.x) + rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    } else if ((event.code === "KeyA" || event.code === "ArrowLeft") && (rodRect.left > 0)) {
        rod1.style.left = (rodRect.x) - rodSpeed + 'px';
        rod2.style.left = rod1.style.left;
    }
}

// Event listener for keyboard input
window.addEventListener('keydown', function (event) {
    if (event.code === "Enter") {
        // Start the game when 'Enter' key is pressed
        if (!gameStarted) {
            gameStarted = true;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDiameter = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            // Update the ball's position and check for collisions
            ballMovement = setInterval(function () {
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                let ballPosition = ballX + ballDiameter / 2;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';

                // Reverse ball direction if it hits the window boundaries
                if ((ballX + ballDiameter) > windowWidth || ballX < 0) {
                    ballSpeedX = -ballSpeedX;
                }

                // Check for collisions with the rods and update the score
                if (ballY <= rod1Height) {
                    ballSpeedY = -ballSpeedY;
                    score++;

                    if ((ballPosition < rod1.getBoundingClientRect().x) || (ballPosition > (rod1.getBoundingClientRect().x + rod1Width))) {
                        storeWinner(ROD_TITLE_2, score);
                    }
                } else if ((ballY + ballDiameter) >= (windowHeight - rod2Height)) {
                    ballSpeedY = -ballSpeedY;
                    score++;

                    if ((ballPosition < rod2.getBoundingClientRect().x) || (ballPosition > (rod2.getBoundingClientRect().x + rod2Width))) {
                        storeWinner(ROD_TITLE_1, score);
                    }
                }
            }, 10);
        }
    } else {
        // Move the rod based on keyboard input
        moveRod(event);
    }
});
