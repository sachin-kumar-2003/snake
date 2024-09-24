const board = document.getElementById("mainGround");
let score = document.getElementById("score");
let highScoreDisplay = document.getElementById("highScore"); // Assuming you have an element to display the high score
let instruction = document.getElementById('instruction');
let snake = [{ x: 10, y: 10 }];
let food = genrateFood();
let direction = "right";
let gameInterval;
let speed = 200;
let gameStarted = false;

// Retrieve high score from localStorage or initialize it to 0
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;
highScoreDisplay.textContent = highScore.toString().padStart(3, "0");

function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function createGameElement(tag, className) {
  const element = document.createElement(tag, className);
  element.className = className;
  return element;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function genrateFood() {
  const x = Math.floor(Math.random() * 19) + 1;
  const y = Math.floor(Math.random() * 19) + 1;
  return { x, y };
}

function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
  }
  snake.unshift(head);
  if (head.x == food.x && head.y == food.y) {
    food = genrateFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
      increaseSpeed();
    }, speed);
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, speed);
}

function handleKeyPress(event) {
  if (
    (!gameStarted && event.code == "Space") ||
    (!gameStarted && event.key == " ")
  ) {
    startGame();
    instruction.style.display = 'none';
  } else {
    let dir = event.key;
    switch (dir) {
      case "w":
        direction = "up";
        break;
      case "s":
        direction = "down";
        break;
      case "a":
        direction = "left";
        break;
      case "d":
        direction = "right";
        break;
    }
  }
}
document.addEventListener("keypress", handleKeyPress);

function increaseSpeed() {
  if (speed > 150) {
    speed -= 5;
  } else if (speed > 100) {
    speed -= 3;
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > 20 || head.y < 1 || head.y > 20) {
    gameOver();
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) {
      gameOver();
    }
  }
}

function gameOver() {
  alert("Game is over!");
  resetGame();
}

function resetGame() {
  clearInterval(gameInterval);
  
  // Update high score if the current score is greater
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem('highScore', highScore); // Save high score to localStorage
    highScoreDisplay.textContent = highScore.toString().padStart(3, "0"); // Update the displayed high score
  }

  snake = [{ x: 10, y: 10 }];
  speed = 200;
  direction = "right";
  gameStarted = false;
  updateScore();
  instruction.style.display = 'flex';
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}
