const TILE = 28;
const HIGH_SCORE_KEY = "pacman_high_scores_v1";
let scoreSaved = false;

/*
  0 = empty
  1 = wall
  2 = dot
  3 = power pellet
*/
const BASE_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,3,1,2,2,2,2,2,2,3,2,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,1,1,1,2,1,1,1,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,2,2,2,2,1,2,1,2,1,1],
  [1,2,1,1,2,1,2,1,1,0,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,2,2,2,0,0,0,2,2,2,2,2,2,2,1],
  [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,2,1],
  [1,2,2,2,2,1,3,2,2,2,2,2,2,1,2,2,2,2,1],
  [1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1],
  [1,3,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,3,1],
  [1,2,1,1,2,1,1,1,2,1,2,1,1,1,2,1,1,2,1],
  [1,2,2,1,2,2,2,2,2,0,2,2,2,2,2,1,2,2,1],
  [1,1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,1],
  [1,2,2,2,2,1,2,2,2,1,2,2,2,1,2,2,2,2,1],
  [1,2,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

/*
  Level 2 map from your new canvas.
  1 = wall
  2 = dot
  3 = power pellet
  0 = empty / spawn space only
*/
const LEVEL_2_MAP = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,1,1,1,3,1,1,1,1,2,1,1,1,1,1],
  [1,2,1,1,1,2,1,1,2,2,2,2,2,2,1,2,2,2,1],
  [1,2,1,2,2,2,2,2,2,2,1,1,1,1,2,1,1,2,1],
  [1,2,1,2,1,2,1,1,1,1,1,2,2,2,2,2,2,2,1],
  [1,2,1,2,1,2,2,2,2,2,2,2,1,2,1,2,1,1,1],
  [1,2,2,2,1,2,1,1,1,1,1,2,1,2,1,2,2,2,1],
  [1,1,1,2,2,2,2,2,2,2,2,2,1,2,1,2,1,2,1],
  [1,2,2,2,1,1,1,1,2,1,2,2,1,2,1,3,1,2,1],
  [1,2,1,1,2,2,2,2,2,2,2,2,2,2,1,1,2,2,1],
  [1,2,2,1,2,2,1,1,1,1,1,1,1,2,1,2,2,2,1],
  [1,1,2,1,2,3,2,2,2,2,2,2,2,2,1,2,1,1,1],
  [1,1,2,1,2,1,1,1,1,1,2,1,1,1,1,2,1,1,1],
  [1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1],
  [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,2,1,1],
  [1,3,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
  [1,2,1,2,1,2,1,1,1,1,1,2,1,2,1,2,1,2,1],
  [1,2,2,2,1,2,2,1,2,2,2,2,1,2,1,2,1,2,1],
  [1,2,1,2,1,1,2,1,2,1,1,1,1,2,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

function cloneMap(map) {
  return map.map(row => [...row]);
}

let MAP = cloneMap(BASE_MAP);

const ROWS = BASE_MAP.length;
const COLS = BASE_MAP[0].length;

const canvas = document.getElementById("game");
canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const messageEl = document.getElementById("message");
const highScoresList = document.getElementById("high-scores-list");

const DIRS = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 }
];

let score = 0;
let lives = 10;
let level = 1;
let gameOver = false;
let win = false;
let paused = false;
let levelTransition = false;
let powerModeTimer = 0;

const defaultMessage =
  "Tap Score to pause on mobile, swipe to move, or press P on desktop";

const pacman = {
  x: 9,
  y: 15,
  dir: 1,
  nextDir: 1,
  mouth: 0
};

const ghosts = [
  { x: 9,  y: 8, dir: 2, color: "#ff4d4d" },
  { x: 8,  y: 9, dir: 1, color: "#7fffd4" },
  { x: 9,  y: 9, dir: 0, color: "#ffb6d9" },
  { x: 10, y: 9, dir: 3, color: "#ffcc66" }
];

function updateScore() {
  scoreEl.textContent = `Score: ${score} | L${level}`;
}

function updateLives() {
  livesEl.textContent = `Lives: ${lives}`;
}

function setDefaultMessage() {
  if (!paused && !gameOver && !win && !levelTransition) {
    messageEl.textContent = defaultMessage;
  }
}

function togglePause() {
  if (gameOver || win || levelTransition) return;

  paused = !paused;

  if (paused) {
    messageEl.textContent = "Paused — tap Score again to resume";
    scoreEl.classList.add("is-paused");
  } else {
    messageEl.textContent = defaultMessage;
    scoreEl.classList.remove("is-paused");
  }
}

function getHighScores() {
  const saved = localStorage.getItem(HIGH_SCORE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveHighScore(finalScore) {
  if (scoreSaved) return;

  const scores = getHighScores();
  scores.push(finalScore);
  scores.sort((a, b) => b - a);

  const topFive = scores.slice(0, 5);
  localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(topFive));

  scoreSaved = true;
  renderHighScores();
}

function renderHighScores() {
  const scores = getHighScores();
  highScoresList.innerHTML = "";

  if (!scores.length) {
    highScoresList.innerHTML = `<li class="empty-score">No scores yet</li>`;
    return;
  }

  scores.forEach((value, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}. ${value}`;
    highScoresList.appendChild(li);
  });
}

function resetPositions() {
  pacman.x = 9;
  pacman.y = 15;
  pacman.dir = 1;
  pacman.nextDir = 1;

  ghosts[0].x = 9;
  ghosts[0].y = 8;
  ghosts[0].dir = 2;

  ghosts[1].x = 8;
  ghosts[1].y = 9;
  ghosts[1].dir = 1;

  ghosts[2].x = 9;
  ghosts[2].y = 9;
  ghosts[2].dir = 0;

  ghosts[3].x = 10;
  ghosts[3].y = 9;
  ghosts[3].dir = 3;
}

function resetLevelMap() {
  if (level === 1) {
    MAP = cloneMap(BASE_MAP);
  } else {
    MAP = cloneMap(LEVEL_2_MAP);

    /* open center spawn zone for level 2 */
    MAP[9][8] = 0;
    MAP[9][9] = 0;
    MAP[9][10] = 0;
    MAP[8][9] = 0;
    MAP[10][9] = 0;
  }
}

function startNextLevel() {
  if (level === 1) {
    level = 2;
    levelTransition = true;
    paused = false;
    powerModeTimer = 0;

    resetLevelMap();
    resetPositions();
    updateScore();
    updateLives();

    messageEl.textContent = "Level 2! New maze and light green walls";

    setTimeout(() => {
      levelTransition = false;
      setDefaultMessage();
    }, 1800);
  } else {
    win = true;
    saveHighScore(score);
    messageEl.textContent = `You cleared Level 2 with ${lives} live${lives === 1 ? "" : "s"} left! Press R or double-tap canvas to restart`;
  }
}

function loseLife() {
  lives--;
  updateLives();

  if (lives <= 0) {
    gameOver = true;
    saveHighScore(score);
    messageEl.textContent = "Game over! Press R or double-tap canvas to restart";
  } else {
    messageEl.textContent = `You were caught! ${lives} chance${lives === 1 ? "" : "s"} left`;
    powerModeTimer = 0;
    resetPositions();

    setTimeout(() => {
      setDefaultMessage();
    }, 1200);
  }
}

function inBounds(x, y) {
  return y >= 0 && y < ROWS && x >= 0 && x < COLS;
}

function isWall(x, y) {
  if (!inBounds(x, y)) return true;
  return MAP[y][x] === 1;
}

function nextTile(entity, dir) {
  return {
    x: entity.x + DIRS[dir].x,
    y: entity.y + DIRS[dir].y
  };
}

function countRemainingDots() {
  let total = 0;

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (MAP[y][x] === 2 || MAP[y][x] === 3) total++;
    }
  }

  return total;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "P") {
    togglePause();
    return;
  }

  if (e.key === "Enter" && document.activeElement === scoreEl) {
    togglePause();
    return;
  }

  if (!paused && !levelTransition) {
    if (e.key === "ArrowUp") pacman.nextDir = 0;
    else if (e.key === "ArrowRight") pacman.nextDir = 1;
    else if (e.key === "ArrowDown") pacman.nextDir = 2;
    else if (e.key === "ArrowLeft") pacman.nextDir = 3;
  }

  if ((gameOver || win) && e.key.toLowerCase() === "r") {
    location.reload();
  }
});

scoreEl.addEventListener("click", togglePause);
scoreEl.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    togglePause();
  },
  { passive: false }
);

let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let lastTapTime = 0;

function handleSwipe(dx, dy) {
  const minSwipeDistance = 24;

  if (Math.abs(dx) < minSwipeDistance && Math.abs(dy) < minSwipeDistance) {
    return;
  }

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) pacman.nextDir = 1;
    else pacman.nextDir = 3;
  } else {
    if (dy > 0) pacman.nextDir = 2;
    else pacman.nextDir = 0;
  }
}

canvas.addEventListener(
  "touchstart",
  (e) => {
    const touch = e.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
  },
  { passive: true }
);

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);

canvas.addEventListener(
  "touchend",
  (e) => {
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const touchDuration = Date.now() - touchStartTime;

    if (
      (gameOver || win) &&
      Math.abs(dx) < 10 &&
      Math.abs(dy) < 10 &&
      touchDuration < 250
    ) {
      const now = Date.now();
      if (now - lastTapTime < 350) {
        location.reload();
        return;
      }
      lastTapTime = now;
    }

    if (!gameOver && !win && !paused && !levelTransition) {
      handleSwipe(dx, dy);
    }
  },
  { passive: true }
);

function drawMap() {
  const wallFill = level === 2 ? "#8fd14f" : "#2f54ff";
  const wallStroke = level === 2 ? "#c6f29b" : "#95a5ff";

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = MAP[y][x];
      const px = x * TILE;
      const py = y * TILE;

      if (cell === 1) {
        ctx.fillStyle = wallFill;
        ctx.fillRect(px, py, TILE, TILE);

        ctx.strokeStyle = wallStroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 1, py + 1, TILE - 2, TILE - 2);

      } else if (cell === 2) {
        ctx.fillStyle = "#f5f5f5";
        ctx.beginPath();
        ctx.arc(px + TILE / 2, py + TILE / 2, 2.2, 0, Math.PI * 2);
        ctx.fill();

      } else if (cell === 3) {
        ctx.strokeStyle = "#e6e6e6";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(px + TILE / 2, py + TILE / 2, 7, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
}

function drawPacman() {
  const cx = pacman.x * TILE + TILE / 2;
  const cy = pacman.y * TILE + TILE / 2;
  const r = TILE / 2 - 3;

  let angleBase = 0;
  if (pacman.dir === 0) angleBase = -Math.PI / 2;
  if (pacman.dir === 1) angleBase = 0;
  if (pacman.dir === 2) angleBase = Math.PI / 2;
  if (pacman.dir === 3) angleBase = Math.PI;

  const mouthOpen = 0.22 + Math.abs(Math.sin(pacman.mouth)) * 0.28;

  ctx.fillStyle = "#ffe100";
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(
    cx,
    cy,
    r,
    angleBase + mouthOpen,
    angleBase + Math.PI * 2 - mouthOpen
  );
  ctx.closePath();
  ctx.fill();
}

function drawGhost(g) {
  const px = g.x * TILE;
  const py = g.y * TILE;
  const bodyColor = powerModeTimer > 0 ? "#2244ff" : g.color;

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.arc(px + TILE / 2, py + TILE / 2 - 3, TILE / 2 - 3, Math.PI, 0);
  ctx.lineTo(px + TILE - 4, py + TILE - 4);
  ctx.lineTo(px + TILE - 8, py + TILE - 8);
  ctx.lineTo(px + TILE - 12, py + TILE - 4);
  ctx.lineTo(px + TILE - 16, py + TILE - 8);
  ctx.lineTo(px + 4, py + TILE - 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(px + 10, py + 12, 3, 0, Math.PI * 2);
  ctx.arc(px + 18, py + 12, 3, 0, Math.PI * 2);
  ctx.fill();
}

function updatePacman() {
  const tryTurn = nextTile(pacman, pacman.nextDir);
  if (!isWall(tryTurn.x, tryTurn.y)) {
    pacman.dir = pacman.nextDir;
  }

  const next = nextTile(pacman, pacman.dir);
  if (!isWall(next.x, next.y)) {
    pacman.x = next.x;
    pacman.y = next.y;
  }

  const cell = MAP[pacman.y][pacman.x];

  if (cell === 2) {
    MAP[pacman.y][pacman.x] = 0;
    score += 10;
    updateScore();
  } else if (cell === 3) {
    MAP[pacman.y][pacman.x] = 0;
    score += 50;
    powerModeTimer = 240;
    updateScore();
  }

  pacman.mouth += 0.35;

  if (countRemainingDots() === 0) {
    startNextLevel();
  }
}

function getValidGhostMoves(g) {
  const moves = [];

  for (let d = 0; d < 4; d++) {
    const n = nextTile(g, d);
    if (!isWall(n.x, n.y)) {
      moves.push({ dir: d, x: n.x, y: n.y });
    }
  }

  return moves;
}

function moveGhost(g) {
  const moves = getValidGhostMoves(g);
  if (!moves.length) return;

  let chosen;

  if (powerModeTimer > 0) {
    chosen = moves[Math.floor(Math.random() * moves.length)];
  } else {
    moves.sort((a, b) => {
      const da = Math.abs(a.x - pacman.x) + Math.abs(a.y - pacman.y);
      const db = Math.abs(b.x - pacman.x) + Math.abs(b.y - pacman.y);
      return da - db;
    });

    const bestMoves = moves.slice(0, 2);
    chosen = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  g.x = chosen.x;
  g.y = chosen.y;
  g.dir = chosen.dir;

  if (g.x === pacman.x && g.y === pacman.y) {
    if (powerModeTimer > 0) {
      score += 200;
      updateScore();
      g.x = 9;
      g.y = 9;
    } else {
      loseLife();
    }
  }
}

function checkGhostCollisionAfterPacmanMove() {
  for (const g of ghosts) {
    if (g.x === pacman.x && g.y === pacman.y) {
      if (powerModeTimer > 0) {
        score += 200;
        updateScore();
        g.x = 9;
        g.y = 9;
      } else {
        loseLife();
      }
      break;
    }
  }
}

function drawOverlay(text) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, canvas.height / 2 - 36, canvas.width, 72);

  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px monospace";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 10);
}

let lastTime = 0;
let moveTimer = 0;
let ghostMoveTimer = 0;

const PACMAN_MOVE_INTERVAL = 150;
const GHOST_MOVE_INTERVAL_LEVEL_1 = 185;
const GHOST_MOVE_INTERVAL_LEVEL_2 = 128.25;

function getGhostMoveInterval() {
  return level === 1
    ? GHOST_MOVE_INTERVAL_LEVEL_1
    : GHOST_MOVE_INTERVAL_LEVEL_2;
}

function loop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  moveTimer += delta;
  ghostMoveTimer += delta;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();

  if (!gameOver && !win && !paused && !levelTransition) {
    if (moveTimer >= PACMAN_MOVE_INTERVAL) {
      moveTimer = 0;
      updatePacman();
      checkGhostCollisionAfterPacmanMove();
    }

    if (!gameOver && !win && ghostMoveTimer >= getGhostMoveInterval()) {
      ghostMoveTimer = 0;

      for (const ghost of ghosts) {
        moveGhost(ghost);
        if (gameOver) break;
      }
    }

    if (powerModeTimer > 0) {
      powerModeTimer--;
    }
  }

  drawPacman();
  ghosts.forEach(drawGhost);

  if (paused && !gameOver && !win) {
    drawOverlay("PAUSED");
  } else if (levelTransition) {
    drawOverlay(`LEVEL ${level}`);
  } else if (gameOver) {
    drawOverlay("GAME OVER");
  } else if (win) {
    drawOverlay("YOU WIN!");
  }

  requestAnimationFrame(loop);
}

resetLevelMap();
updateScore();
updateLives();
renderHighScores();
requestAnimationFrame(loop);