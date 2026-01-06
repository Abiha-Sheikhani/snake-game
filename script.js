// ===== CANVAS SETUP =====
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// ===== GAME CONSTANTS =====
const box = 20;

// ===== GAME VARIABLES =====
let snake;
let food;
let direction;
let score;
let game;

// ===== INITIALIZE GAME =====
function initGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  food = generateFood();
  direction = null;
  score = 0;

  document.getElementById("score").innerText = "Score: " + score;

  if (game) clearInterval(game);
  game = setInterval(draw, 120);
}

initGame();

// ===== FOOD GENERATOR =====
function generateFood() {
  return {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  };
}

// ===== KEYBOARD CONTROL =====
document.addEventListener("keydown", changeDirection);

function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}
// ===== MOBILE SWIPE CONTROLS =====
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", function (e) {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", function (e) {
  const touch = e.changedTouches[0];
  const touchEndX = touch.clientX;
  const touchEndY = touch.clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  // Decide swipe direction
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
    else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
  } else {
    if (dy > 0 && direction !== "UP") direction = "DOWN";
    else if (dy < 0 && direction !== "DOWN") direction = "UP";
  }
});

// ===== COLLISION CHECK =====
function collision(head, body) {
  for (let i = 0; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }
  return false;
}

// ===== MAIN GAME LOOP =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Current head position
  let headX = snake[0].x;
  let headY = snake[0].y;

  // Move snake
  if (direction === "LEFT") headX -= box;
  if (direction === "UP") headY -= box;
  if (direction === "RIGHT") headX += box;
  if (direction === "DOWN") headY += box;

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById("score").innerText = "Score: " + score;
    food = generateFood();
  } else {
    snake.pop();
  }

  let newHead = { x: headX, y: headY };

  // Game over conditions
  if (
    headX < 0 ||
    headY < 0 ||
    headX >= canvas.width ||
    headY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
canvas.classList.add("game-over");

setTimeout(() => {
  alert("Game Over! Score: " + score);
  canvas.classList.remove("game-over");
}, 400);
return;

  }

  snake.unshift(newHead);
}

// ===== RESTART BUTTON =====
function restartGame() {
  initGame();
}
