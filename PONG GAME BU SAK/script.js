const canvas = document.querySelector("#ping-pong");

const context = canvas.getContext("2d");

const startBtn = document.querySelector(".start-btn");

const pauseBtn = document.querySelector(".pause-btn");

const restartBtn = document.querySelector(".restart-btn");

let gameRunning = false;

let animationId;

//BUAT PADDLE PENGGUNA
const user = {
 x: 0,
 y: canvas.height/2 - 100/2,
 width: 10,
 height: 100,
 color: "red",
 score: 0
}

//BUAT PADDLE KOMPUTER
const computer = {
 x: canvas.width - 10,
 y: canvas.height/2 - 100/2,
 width: 10,
 height: 100,
 color: "black",
 score: 0
}

//BUAT BOLA
const ball = {
 x: canvas.width / 2,
 y: canvas.height / 2,
 radius: 10,
 speed: 5,
 velocityX: 5,
 velocityY: 5,
 color: "white"
}

//BUAT JARINGAN
const net = {
 x: canvas.width/2 - 1,
 y: 0,
 width: 2,
 height: 10,
 color: "white"
}

restartBtn.addEventListener("click", () => {
 document.location.reload();
});

addEventListener("load", (event) => {
 render();
});

//GAMBAR FUNGSI BERSIH
function drawNet() {
    const netWidth = 4; // Sesuaikan lebar jaring sesuai kebutuhan
    const netSpacing = 15; // Sesuaikan jarak sesuai kebutuhan

    // Gambarlah bagian kiri jaringnya
    for (let i = 0; i <= canvas.height; i += netSpacing) {
        drawRectangle(net.x, net.y + i, netWidth, net.height, net.color);
    }

    // Gambarlah separuh bagian kanan jaring
    for (let i = 0; i <= canvas.height; i += netSpacing) {
        drawRectangle(net.x + net.width - netWidth, net.y + i, netWidth, net.height, net.color);
    }
}


//GAMBAR FUNGSI PERSEGI PANJANG
function drawRectangle(x, y, w, h, color) {
 context.fillStyle = color;
 context.fillRect(x, y, w, h);
}

//GAMBAR FUNGSI LINGKARAN
function drawCircle(x, y, r, color) {
 context.fillStyle = color;
 context.beginPath();
 context.arc(x, y, r, 0, Math.PI * 2, false);
 context.closePath();
 context.fill();
}

//GAMBAR FUNGSI TEKS
function drawText(text, x, y, color) {
 context.fillStyle = color;
 context.font = "45px fantasy";
 context.fillText(text, x, y);
}

//FUNGSI PERMAINAN RENDER
// Inside the render() function
function render() {
   // HAPUS KANVAS
    drawRectangle(0, 0, canvas.width, canvas.height, "green");

    // GAMBAR JARINGAN
    drawNet();

    // GAMBAR SKORnya
    drawText(user.score, canvas.width / 4, canvas.height / 5, "white");
    drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 5, "white");

    // GAMBAR PADDLES PENGGUNA DAN KOMPUTER
    drawRectangle(user.x, user.y, user.width, user.height, user.color);
    drawRectangle(computer.x, computer.y, computer.width, computer.height, computer.color);

   // GAMBAR BOLA
    drawCircle(ball.x, ball.y, ball.radius, ball.color);

   // GAMBAR GARIS PUTIH DI TENGAH
    drawRectangle(net.x, net.y, net.width, canvas.height, net.color);
}

//KONTROL PADDLE PENGGUNA
canvas.addEventListener("mousemove", movePaddle);

function movePaddle(evt) {
 let rectangle = canvas.getBoundingClientRect();

 user.y = evt.clientY - rectangle.top - user.height/2;
}

//FUNGSI DETEKSI TUBUH
function collision(b, p) {
 b.top = b.y - b.radius;
 b.bottom = b.y + b.radius;
 b.left = b.x - b.radius;
 b.right = b.x + b.radius;

 p.top = p.y;
 p.bottom = p.y + p.height;
 p.left = p.x;
 p.right = p.x + p.width;

 return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom; 
}

//RESET FUNGSI BOLA
function resetBall() {
 ball.x = canvas.width / 2;
 ball.y = canvas.height / 2;

 ball.speed = 5;
 ball.velocityX = -ball.velocityX;
}

//FUNGSI PEMBARUAN
function update() {
 ball.x += ball.velocityX;
 ball.y += ball.velocityY;

 //AI SEDERHANA UNTUK MENGONTROL PADDLE KOMPUTER
 let computerLevel = 0.1;
 computer.y += (ball.y - (computer.y + computer.height/2)) * computerLevel;

 if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
  ball.velocityY = -ball.velocityY;
 }

 let player = (ball.x < canvas.width/2) ? user : computer;

 if(collision(ball, player)) {
//DIMANA BOLA MENGHADAP PEMAIN
  let collidePoint = ball.y - (player.y + player.height/2);

  //NORMALISASI
  collidePoint = collidePoint / (player.height/2);

  //HITUNG SUDUT DALAM RADIAN
  let angleRad = collidePoint * Math.PI/4;

 //X ARAH BOLA SAAT DIHIT
  let direction = (ball.x < canvas.width/2) ? 1 : -1;


  //PERUBAHAN KECEPATAN X DAN Y
  ball.velocityX = direction * ball.speed * Math.cos(angleRad);

  ball.velocityY = ball.speed * Math.sin(angleRad);

 //Setiap kali bola dipukul oleh dayung, kita meningkatkan kecepatannya
  ball.speed += 0.5;
 }
//PERBARUI SKOR
 if(ball.x - ball.radius < 0) {
 // KOMPUTER MENDAPAT 1 POIN
  computer.score++;
  resetBall();
 } else if(ball.x + ball.radius > canvas.width){
  //PENGGUNA MENDAPATKAN 1 POIN
  user.score++;
  resetBall();
 }
}

//FUNGSI INISIALISASI GAME
function animate() {
    if(!gameRunning) {
        return; 
    }

    update();
    render();
    animationId = requestAnimationFrame(animate);
}


startBtn.addEventListener("click", () => {
    if (!gameRunning) {
        gameRunning = true;
        animate();
    }
});

pauseBtn.addEventListener("click", () => {
    gameRunning = false;
    cancelAnimationFrame(animationId);
});