// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

//ball class
class Ball 
{
  constructor(x, y, velX, velY, color, size)
  {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  draw()
  {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() 
  {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() 
  {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
            const nx = dx / distance;
            const ny = dy / distance;
            const overlap = this.size + ball.size - distance;

            this.x += (overlap / 2) * nx;
            this.y += (overlap / 2) * ny;

            ball.x -= (overlap / 2) * nx;
            ball.y -= (overlap / 2) * ny;

            const p = 2 *(this.velX * nx + this.velY * ny -ball.velX * nx - ball.velY * ny)/2;

            this.velX -= p * nx;
            this.velY -= p * ny;

            ball.velX += p * nx;
            ball.velY += p * ny;
            ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

//actual ball creation system here
const balls = [];

while (balls.length < 25) {
  const size = random(5, 50);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-15, 15),
    random(-15, 15),
    randomRGB(),
    size,
  );

  balls.push(ball);
}

//go through and update the balls (basically make them move)
function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();