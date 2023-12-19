const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');


const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 5,
};


const circles = [];
const bullets = [];
const bulletSpeed = 7;


// Generate random number between min and max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


// Create random circle
function createCircle() {
  const circle = {
    x: getRandomNumber(20, canvas.width - 20),
    y: getRandomNumber(20, canvas.height - 20),
    radius: 20,
    dx: getRandomNumber(-3, 3),
    dy: getRandomNumber(-3, 3),
  };
  circles.push(circle);
}


// Draw player on the canvas
function drawPlayer() {
  ctx.fillStyle = '#3498db';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}


// Draw circles on the canvas
function drawCircles() {
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();
  });
}


// Draw bullets on the canvas
function drawBullets() {
  bullets.forEach(bullet => {
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(bullet.x, bullet.y, 5, 5);
  });
}


// Update player position
function updatePlayerPosition() {
  // Move towards the mouse position
  const angle = Math.atan2(player.y - mouseY, player.x - mouseX);
  player.x -= player.speed * Math.cos(angle);
  player.y -= player.speed * Math.sin(angle);


  // Keep player within canvas bounds
  player.x = Math.max(player.size / 2, Math.min(canvas.width - player.size / 2, player.x));
  player.y = Math.max(player.size / 2, Math.min(canvas.height - player.size / 2, player.y));
}


// Update circle positions and handle collisions
function updateCircles() {
  circles.forEach(circle => {
    circle.x += circle.dx;
    circle.y += circle.dy;


    // Bounce off the walls
    if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width) {
      circle.dx = -circle.dx;
    }


    if (circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height) {
      circle.dy = -circle.dy;
    }
  });
}


// Update bullet positions and handle collisions
function updateBullets() {
  bullets.forEach((bullet, bulletIndex) => {
    bullet.x += bulletSpeed * Math.cos(bullet.direction);
    bullet.y += bulletSpeed * Math.sin(bullet.direction);


    // Remove bullets that go off the canvas
    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(bulletIndex, 1);
    }


    // Check for collisions with circles
    circles.forEach((circle, circleIndex) => {
      const distance = Math.sqrt((bullet.x - circle.x) ** 2 + (bullet.y - circle.y) ** 2);


      if (distance < circle.radius + 5) {
        bullets.splice(bulletIndex, 1);
        circles.splice(circleIndex, 1);
      }
    });
  });
}


// Handle mouse down events
function handleMouseDown(event) {
  const bullet = {
    x: player.x,
    y: player.y,
    direction: Math.atan2(event.clientY - player.y, event.clientX - player.x),
  };
  bullets.push(bullet);
}


canvas.addEventListener('mousedown', handleMouseDown);


// Get mouse position
let mouseX, mouseY;


canvas.addEventListener('mousemove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});


// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  updatePlayerPosition();
  drawPlayer();


  drawCircles();
  updateCircles();


  drawBullets();
  updateBullets();


  requestAnimationFrame(gameLoop);
}


// Initialize the game
function init() {
  for (let i = 0; i < 5; i++) {
    createCircle();
  }


  gameLoop();
}


// Run the game
init();
