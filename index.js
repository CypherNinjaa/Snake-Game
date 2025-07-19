// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("food.mp3");
const gameOverSound = new Audio("gameover.mp3");
const moveSound = new Audio("move.mp3");
const musicSound = new Audio("music.mp3");


// Configure audio settings
foodSound.volume = 0.5;
gameOverSound.volume = 0.7;
moveSound.volume = 0.3;
musicSound.volume = 0.4;
musicSound.loop = true;

let speed = 5;
let score = 0;
let lastPaintTime = 0;
let gameRunning = false;
let gamePaused = false;
let snakeArr = [{ x: 13, y: 15 }];

food = { x: 6, y: 7 };

// Game Functions
function main(ctime) {
	window.requestAnimationFrame(main);
	if (gamePaused || !gameRunning) return;

	if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
		return;
	}
	lastPaintTime = ctime;
	gameEngine();
}

function isCollide(snake) {
	// If you bump into yourself
	for (let i = 1; i < snakeArr.length; i++) {
		if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
			return true;
		}
	}
	// If you bump into the wall
	if (
		snake[0].x >= 18 ||
		snake[0].x <= 0 ||
		snake[0].y >= 18 ||
		snake[0].y <= 0
	) {
		return true;
	}

	return false;
}

function gameEngine() {
	// Part 1: Updating the snake array & Food
	if (isCollide(snakeArr)) {
		gameOver();
		return;
	}

	// If you have eaten the food, increment the score and regenerate the food
	if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
		foodSound.play().catch((e) => console.log("Audio play failed:", e));
		score += 1;

		// Increase speed slightly as score increases
		if (score % 5 === 0) {
			speed += 0.5;
		}

		if (score > hiscoreval) {
			hiscoreval = score;
			localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
			hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
		}
		scoreBox.innerHTML = "Score: " + score;
		snakeArr.unshift({
			x: snakeArr[0].x + inputDir.x,
			y: snakeArr[0].y + inputDir.y,
		});
		let a = 2;
		let b = 16;
		food = {
			x: Math.round(a + (b - a) * Math.random()),
			y: Math.round(a + (b - a) * Math.random()),
		};
	}

	// Moving the snake
	for (let i = snakeArr.length - 2; i >= 0; i--) {
		snakeArr[i + 1] = { ...snakeArr[i] };
	}

	snakeArr[0].x += inputDir.x;
	snakeArr[0].y += inputDir.y;

	// Part 2: Display the snake and Food
	displayGame();
}

function gameOver() {
	gameOverSound.play().catch((e) => console.log("Audio play failed:", e));
	musicSound.pause();
	gameRunning = false;
	inputDir = { x: 0, y: 0 };

	// Create game over overlay
	const gameOverDiv = document.createElement("div");
	gameOverDiv.id = "gameOverScreen";
	gameOverDiv.innerHTML = `
        <div class="game-over-content">
            <h2>Game Over!</h2>
            <p>Final Score: ${score}</p>
            <p>High Score: ${hiscoreval}</p>
            <button onclick="restartGame()">Play Again</button>
        </div>
    `;
	document.body.appendChild(gameOverDiv);
}

function restartGame() {
	// Remove game over screen
	const gameOverScreen = document.getElementById("gameOverScreen");
	if (gameOverScreen) {
		gameOverScreen.remove();
	}

	// Reset game state
	snakeArr = [{ x: 13, y: 15 }];
	score = 0;
	speed = 5;
	inputDir = { x: 0, y: 0 };
	scoreBox.innerHTML = "Score: " + score;
	gameRunning = false;
	gamePaused = false;

	// Generate new food
	let a = 2;
	let b = 16;
	food = {
		x: Math.round(a + (b - a) * Math.random()),
		y: Math.round(a + (b - a) * Math.random()),
	};

	displayGame();
	musicSound.play().catch((e) => console.log("Audio play failed:", e));
}

function togglePause() {
	if (!gameRunning) return;

	gamePaused = !gamePaused;
	if (gamePaused) {
		musicSound.pause();
		showPauseScreen();
	} else {
		musicSound.play().catch((e) => console.log("Audio play failed:", e));
		hidePauseScreen();
	}
}

function showPauseScreen() {
	const pauseDiv = document.createElement("div");
	pauseDiv.id = "pauseScreen";
	pauseDiv.innerHTML = `
        <div class="pause-content">
            <h2>Game Paused</h2>
            <p>Press SPACE to continue</p>
        </div>
    `;
	document.body.appendChild(pauseDiv);
}

function hidePauseScreen() {
	const pauseScreen = document.getElementById("pauseScreen");
	if (pauseScreen) {
		pauseScreen.remove();
	}
}

function displayGame() {
	// Display the snake
	board.innerHTML = "";
	snakeArr.forEach((e, index) => {
		snakeElement = document.createElement("div");
		snakeElement.style.gridRowStart = e.y;
		snakeElement.style.gridColumnStart = e.x;

		if (index === 0) {
			snakeElement.classList.add("head");
		} else {
			snakeElement.classList.add("snake");
		}
		board.appendChild(snakeElement);
	});

	// Display the food
	foodElement = document.createElement("div");
	foodElement.style.gridRowStart = food.y;
	foodElement.style.gridColumnStart = food.x;
	foodElement.classList.add("food");
	board.appendChild(foodElement);
}

// Main logic starts here
let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
	hiscoreval = 0;
	localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
	hiscoreval = JSON.parse(hiscore);
	hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

// Initialize display
displayGame();

window.requestAnimationFrame(main);

// Keyboard controls
window.addEventListener("keydown", (e) => {
	// Start game on first key press
	if (!gameRunning && inputDir.x === 0 && inputDir.y === 0) {
		gameRunning = true;
		musicSound.play().catch((e) => console.log("Audio play failed:", e));
	}

	// Handle pause
	if (e.key === " " || e.key === "Spacebar") {
		e.preventDefault();
		togglePause();
		return;
	}

	if (gamePaused) return;

	// Play move sound for arrow keys only
	if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
		moveSound.play().catch((e) => console.log("Audio play failed:", e));
	}

	switch (e.key) {
		case "ArrowUp":
		case "w":
		case "W":
			if (inputDir.y !== 1) {
				// Prevent reversing
				inputDir.x = 0;
				inputDir.y = -1;
			}
			break;

		case "ArrowDown":
		case "s":
		case "S":
			if (inputDir.y !== -1) {
				// Prevent reversing
				inputDir.x = 0;
				inputDir.y = 1;
			}
			break;

		case "ArrowLeft":
		case "a":
		case "A":
			if (inputDir.x !== 1) {
				// Prevent reversing
				inputDir.x = -1;
				inputDir.y = 0;
			}
			break;

		case "ArrowRight":
		case "d":
		case "D":
			if (inputDir.x !== -1) {
				// Prevent reversing
				inputDir.x = 1;
				inputDir.y = 0;
			}
			break;
		default:
			break;
	}
});

// Touch controls for mobile
let touchStartX = null;
let touchStartY = null;

board.addEventListener("touchstart", (e) => {
	e.preventDefault();
	touchStartX = e.touches[0].clientX;
	touchStartY = e.touches[0].clientY;

	// Start game on first touch
	if (!gameRunning && inputDir.x === 0 && inputDir.y === 0) {
		gameRunning = true;
		musicSound.play().catch((e) => console.log("Audio play failed:", e));
	}
});

board.addEventListener("touchend", (e) => {
	e.preventDefault();
	if (touchStartX === null || touchStartY === null || gamePaused) return;

	const touchEndX = e.changedTouches[0].clientX;
	const touchEndY = e.changedTouches[0].clientY;

	const deltaX = touchEndX - touchStartX;
	const deltaY = touchEndY - touchStartY;

	const minSwipeDistance = 30;

	if (Math.abs(deltaX) > Math.abs(deltaY)) {
		// Horizontal swipe
		if (Math.abs(deltaX) > minSwipeDistance) {
			if (deltaX > 0 && inputDir.x !== -1) {
				// Swipe right
				inputDir.x = 1;
				inputDir.y = 0;
				moveSound.play().catch((e) => console.log("Audio play failed:", e));
			} else if (deltaX < 0 && inputDir.x !== 1) {
				// Swipe left
				inputDir.x = -1;
				inputDir.y = 0;
				moveSound.play().catch((e) => console.log("Audio play failed:", e));
			}
		}
	} else {
		// Vertical swipe
		if (Math.abs(deltaY) > minSwipeDistance) {
			if (deltaY > 0 && inputDir.y !== -1) {
				// Swipe down
				inputDir.x = 0;
				inputDir.y = 1;
				moveSound.play().catch((e) => console.log("Audio play failed:", e));
			} else if (deltaY < 0 && inputDir.y !== 1) {
				// Swipe up
				inputDir.x = 0;
				inputDir.y = -1;
				moveSound.play().catch((e) => console.log("Audio play failed:", e));
			}
		}
	}

	touchStartX = null;
	touchStartY = null;
});
