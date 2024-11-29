// Setup canvas dan konteks gambar
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ukuran canvas sesuai ukuran layar perangkat
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdGravity = 1; // Mengatur gravitasi agar lebih berat
let birdLift = -15;  // Kecepatan flap burung
let birdWidth = 30;
let birdHeight = 30;
let isFlapping = false;
let pipes = [];
let pipeWidth = 60;
let pipeGap = 120;  // Lebar celah antar pipa
let pipeVelocity = 5;  // Kecepatan pipa yang lebih cepat
let score = 0;
let gameOver = false;

// Event listener untuk kontrol dengan tap
document.addEventListener('touchstart', flap);

// Fungsi flap ketika layar disentuh
function flap(event) {
    if (!gameOver) {
        birdVelocity = birdLift;
    }
}

// Fungsi untuk menggambar burung
function drawBird() {
    birdVelocity += birdGravity;
    birdY += birdVelocity;

    // Membatasi burung agar tidak keluar canvas
    if (birdY > canvas.height - birdHeight) {
        birdY = canvas.height - birdHeight;
        birdVelocity = 0;
    }
    if (birdY < 0) {
        birdY = 0;
        birdVelocity = 0;
    }

    ctx.fillStyle = '#ff0'; // Warna burung
    ctx.fillRect(50, birdY, birdWidth, birdHeight);
}

// Fungsi untuk menggambar pipa
function drawPipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            topHeight: pipeHeight,
            bottomHeight: canvas.height - pipeGap - pipeHeight
        });
    }

    // Menggerakkan dan menggambar pipa
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeVelocity;  // Pipa bergerak lebih cepat
        ctx.fillStyle = '#228B22'; // Warna pipa
        ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].topHeight); // Pipa atas
        ctx.fillRect(pipes[i].x, canvas.height - pipes[i].bottomHeight, pipeWidth, pipes[i].bottomHeight); // Pipa bawah

        // Deteksi tabrakan dengan pipa
        if (
            (50 + birdWidth > pipes[i].x && 50 < pipes[i].x + pipeWidth) &&
            (birdY < pipes[i].topHeight || birdY + birdHeight > canvas.height - pipes[i].bottomHeight)
        ) {
            gameOver = true;
        }

        // Hapus pipa yang sudah keluar dari layar dan tambahkan skor
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
            i--;
            if (!gameOver) score++;
        }
    }
}

// Fungsi untuk menggambar skor
function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

// Fungsi untuk menggambar game over
function drawGameOver() {
    ctx.fillStyle = '#000';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Tap to Restart', canvas.width / 3, canvas.height / 1.8);
}

// Fungsi untuk merender game
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Hapus canvas

    if (gameOver) {
        drawGameOver();
        return;
    }

    drawBird();
    drawPipes();
    drawScore();

    requestAnimationFrame(render);
}

// Mulai game
render();
