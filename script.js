// Background Interactive Floating Heart Particles
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -1 - 0.5;
        this.color = `hsl(${Math.random() * 60 + 330}, 100%, 75%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > 0.2) this.size -= 0.01;
        if (this.y < 0) {
            this.y = canvas.height;
            this.x = Math.random() * canvas.width;
            this.size = Math.random() * 5 + 1;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    for (let i = 0; i < 80; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();

// Music Control
const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

musicBtn.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicBtn.innerText = "⏸️ Pause Music";
    } else {
        music.pause();
        musicBtn.innerText = "🎵 Play Music";
    }
});

// Surprise Celebration Trigger
document.getElementById('surprise-btn').addEventListener('click', () => {
    // Confetti Fireworks Blast Effect
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
