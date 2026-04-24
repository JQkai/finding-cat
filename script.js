'use strict';

const gameArea = document.getElementById('gameArea');
const scene = document.getElementById('scene');
const foundCountEl = document.getElementById('foundCount');
const totalCountEl = document.getElementById('totalCount');
const timerEl = document.getElementById('timer');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayDesc = document.getElementById('overlayDesc');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

let foundCount = 0;
const totalCats = 10;
let timeLeft = 60;
let timerInterval = null;
let isPlaying = false;

const catStyles = [
  { color: '#000000' },
  { color: '#121212' },
  { color: '#1a1a1b' },
  { color: '#0f0a05' },
  { color: '#0a0d14' },
];

const furnitureData = [
  { svg: '<rect width="200" height="80" rx="20" fill="#92400e"/><rect x="20" y="-30" width="160" height="60" rx="15" fill="#b45309"/>', w: 200, h: 100 },
  { svg: '<rect width="120" height="250" fill="#78350f"/><rect x="10" y="10" width="100" height="10" fill="#451a03"/><rect x="10" y="50" width="100" height="10" fill="#451a03"/>', w: 120, h: 250 },
  { svg: '<rect x="30" y="60" width="40" height="50" fill="#92400e"/><path d="M50,10 Q80,40 50,70 Q20,40 50,10" fill="#15803d"/>', w: 100, h: 120 },
  { svg: '<rect width="150" height="15" fill="#d97706"/><rect x="20" y="15" width="10" height="40" fill="#b45309"/>', w: 150, h: 60 },
];

function createScene() {
  scene.innerHTML = '';
  for (let i = 0; i < 22; i += 1) {
    const data = furnitureData[Math.floor(Math.random() * furnitureData.length)];
    const furniture = document.createElement('div');
    furniture.className = 'furniture';
    furniture.style.left = `${Math.random() * 85}%`;
    furniture.style.top = `${Math.random() * 80}%`;
    furniture.style.zIndex = `${Math.floor(Math.random() * 10) + 1}`;
    furniture.innerHTML = `<svg width="${data.w}" height="${data.h}">${data.svg}</svg>`;
    scene.appendChild(furniture);
  }
}

function showMeow(x, y) {
  const bubble = document.createElement('div');
  const rect = gameArea.getBoundingClientRect();
  bubble.className = 'meow-bubble';
  bubble.innerText = '抓到你了！🐾';
  bubble.style.left = `${x - rect.left}px`;
  bubble.style.top = `${y - rect.top}px`;
  gameArea.appendChild(bubble);
  setTimeout(() => bubble.remove(), 1000);
}

function endGame(isWin) {
  isPlaying = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  overlay.classList.remove('hidden');
  if (isWin) {
    overlayTitle.innerText = '剪影守護者！';
    overlayDesc.innerText = `你找齊了所有坐姿貓咪剪影！剩餘：${timeLeft} 秒。`;
  } else {
    overlayTitle.innerText = '時間結束！';
    overlayDesc.innerText = `剪影貓咪躲得很好呢，你抓到了 ${foundCount} 隻。`;
  }
  startBtn.innerText = '再玩一次';
}

function spawnCats() {
  for (let i = 0; i < totalCats; i += 1) {
    const cat = document.createElement('div');
    const style = catStyles[Math.floor(Math.random() * catStyles.length)];

    cat.className = 'cat';
    cat.style.left = `${5 + Math.random() * 85}%`;
    cat.style.top = `${20 + Math.random() * 70}%`;
    cat.style.zIndex = '20';
    cat.innerHTML = `
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <path fill="${style.color}" d="
          M80,85
          C88,85 92,82 92,75
          C92,68 85,65 80,65
          L80,40
          C80,30 75,22 65,22
          L45,22
          C35,22 30,30 30,40
          L30,55
          C22,55 12,60 12,75
          C12,85 20,90 35,90
          L80,90 Z
          M40,22 L35,10 L45,18 Z
          M60,22 L65,10 L55,18 Z
        " />
        <circle class="cat-eye hidden" cx="42" cy="35" r="3" fill="white" />
        <circle class="cat-eye hidden" cx="58" cy="35" r="3" fill="white" />
      </svg>
    `;

    cat.addEventListener('click', event => {
      if (!isPlaying || cat.classList.contains('found')) {
        return;
      }

      cat.classList.add('found');
      cat.querySelectorAll('.cat-eye').forEach(eye => eye.classList.remove('hidden'));

      foundCount += 1;
      foundCountEl.innerText = String(foundCount);
      showMeow(event.clientX, event.clientY);

      if (foundCount === totalCats) {
        endGame(true);
      }
    });

    scene.appendChild(cat);
  }
}

function startGame() {
  foundCount = 0;
  timeLeft = 60;
  isPlaying = true;

  foundCountEl.innerText = '0';
  totalCountEl.innerText = String(totalCats);
  timerEl.innerText = String(timeLeft);
  overlay.classList.add('hidden');

  createScene();
  spawnCats();

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    if (timeLeft < 0) {
      timeLeft = 0;
    }
    timerEl.innerText = String(timeLeft);
    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

function resetGame() {
  isPlaying = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  foundCount = 0;
  timeLeft = 60;
  foundCountEl.innerText = '0';
  totalCountEl.innerText = String(totalCats);
  timerEl.innerText = String(timeLeft);

  overlay.classList.remove('hidden');
  overlayTitle.innerText = '找貓咪大冒險';
  overlayDesc.innerText = '準備好再次尋找可愛的貓咪剪影了嗎？';
  startBtn.innerText = '開始遊戲';

  createScene();
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);

window.addEventListener('load', () => {
  totalCountEl.innerText = String(totalCats);
  createScene();
});