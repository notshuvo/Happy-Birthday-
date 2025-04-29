const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let fireworks = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Firework {
  constructor() {
    this.x = random(0, canvas.width);
    this.y = canvas.height;
    this.targetY = random(100, canvas.height / 2);
    this.color = `hsl(${random(0, 360)}, 100%, 50%)`;
    this.size = 2;
    this.velocity = 5;
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.y -= this.velocity;
      if (this.y <= this.targetY) {
        this.exploded = true;
        this.createParticles();
      }
    }
  }

  createParticles() {
    for (let i = 0; i < 30; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = 2;
    this.alpha = 1;
    this.velocityX = random(-3, 3);
    this.velocityY = random(-3, 3);
    this.gravity = 0.05;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += this.gravity;
    this.alpha -= 0.02;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < 0.05) {
    fireworks.push(new Firework());
  }

  fireworks.forEach((fw, index) => {
    fw.update();
    fw.draw();

    fw.particles.forEach((p, i) => {
      p.update();
      p.draw();
      if (p.alpha <= 0) fw.particles.splice(i, 1);
    });

    if (fw.exploded && fw.particles.length === 0) {
      fireworks.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}
animate();