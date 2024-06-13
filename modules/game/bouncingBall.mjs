const popup = document.getElementById('popup');
const countdownElement = document.getElementById('countdown');
const countdownSound = document.getElementById('countdown-sound');
const spaceSound = document.getElementById('space-sound');
const backgroundMusic = document.getElementById('background-music');
const scoreDisplay = document.getElementById('player-score');
const highScoreDisplay = document.getElementById('high-score');
const playerLifeDisplay = document.getElementById('player-life');
const canvas = document.querySelector('#canvas');
const obstaclesContainer = document.querySelector('#obstacles-container');

let countdown = 3;
let score = 0;
let isGameOver = false;
let playerLife = 100;
const SPEED = 150;
let x = canvas.width / 2;
let y = canvas.height * 0.8;
let velocity = SPEED;

import { animate } from "../engine/animation.mjs";
import { down } from "../engine/input.mjs";

function updateCountdown() {
    if (countdown > 0) {
        countdownElement.textContent = `Começando em ${countdown} segundos...`;
        countdownSound.play();
        countdown--;
        setTimeout(updateCountdown, 1000);
    } else {
        countdownElement.textContent = "Vai!!";
        setTimeout(() => {
            countdownElement.style.display = 'none';
            startGame();
        }, 1000);
    }
}

function updateScore() {
    if (!isGameOver) {
        score++;
        scoreDisplay.textContent = `Pontos: ${score}`;
        setTimeout(updateScore, 1000);
    }
}

function startGame() {
    popup.style.display = 'none';
    backgroundMusic.play();
    gameLoop();
    updateScore();
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

let imgParam = getQueryParam('PresonagemSelecionado');
let imagePath = `./imagens/ImagenJogo_${imgParam}.png`;
const image = new Image();
image.src = imagePath;

image.onload = function() {
    animate(canvas, { update, draw });
};

function fetchCharacterRecord() {
    fetch('/dados.json')
        .then(response => response.json())
        .then(data => {
            console.log('Dados recebidos:', data); // Log de depuração
            if (data.highScores && Array.isArray(data.highScores)) {
                const characterRecord = data.highScores.find(record => record.character === imgParam);
                highScoreDisplay.textContent = `Recorde: ${characterRecord ? characterRecord.record : 0} pontos`;
            } else {
                console.error('Estrutura do JSON inesperada:', data);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os recordes dos personagens:', error);
        });
}

async function saveHighScore(score) {
    try {
        const response = await fetch('/dados.json');
        const data = await response.json();
        console.log('Dados para salvar:', data); // Log de depuração

        if (data.highScores && Array.isArray(data.highScores)) {
            const characterRecord = data.highScores.find(record => record.character === imgParam);

            if (characterRecord) {
                if (score > characterRecord.record) {
                    characterRecord.record = score;
                    highScoreDisplay.textContent = `Recorde: ${score} pontos`;

                    const saveResponse = await fetch('/dados.json', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ highScores: data.highScores })
                    });

                    if (!saveResponse.ok) {
                        throw new Error('Erro ao salvar o recorde');
                    } else {
                        console.log('Recorde salvo com sucesso');
                        alert('Parabéns, você bateu o recorde!');
                        window.location.href = 'inicio.html';
                    }

                    if (!saveResponse.ok) {
                        throw new Error('Erro ao salvar o recorde');
                    }
                    else{
                        console.log('Recorde salvo com sucesso');
                        alert('Parabéns, você bateu o recorde!');
                        window.location.href = 'inicio.html';
                        
                    }
                }
                else
                {
                    window.location.href = 'inicio.html';
                }
            } else {
                console.error('Recorde do personagem não encontrado');
            }
        } else {
            console.error('Estrutura do JSON inesperada:', data);
        }
    } catch (error) {
        console.error('Erro ao buscar e salvar os recordes:', error);
    }
}

function update(time) {
    if (down('ArrowLeft') && x > 69.5) x -= velocity * time;
    else if (down('ArrowRight') && x <= canvas.width - 8.5) x += velocity * time;
}

function draw(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image.complete) {
        ctx.drawImage(image, x - 72.5, y, 85, 22);
    } else {
        console.log('Imagem não carregada ainda');
    }
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    const type = Math.floor(Math.random() * 3) + 1;
    obstacle.classList.add(`type${type}`);

    let newLeft;
    let isOverlapping;

    do {
        newLeft = Math.floor(Math.random() * (canvas.width - 50));
        obstacle.style.left = `${newLeft}px`;
        obstacle.style.top = '0px';

        isOverlapping = Array.from(document.querySelectorAll('.obstacle')).some(existingObstacle => {
            const existingLeft = parseInt(existingObstacle.style.left);
            const existingTop = parseInt(existingObstacle.style.top);
            return Math.abs(existingLeft - newLeft) < 80 && Math.abs(existingTop - 0) < 80;
        });
    } while (isOverlapping);

    obstaclesContainer.appendChild(obstacle);
}

function createRepairKit() {
    const repairKit = document.createElement('div');
    repairKit.classList.add('repair-kit');
    repairKit.style.left = `${Math.floor(Math.random() * (canvas.width - 50))}px`;
    repairKit.style.top = '0px';
    obstaclesContainer.appendChild(repairKit);
}

function moveObstacles() {
    const obstacles = document.querySelectorAll('.obstacle, .repair-kit');
    obstacles.forEach(obstacle => {
        let obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
        if (obstacleTop >= canvas.offsetHeight) {
            obstacle.remove();
        } else {
            obstacle.style.top = `${obstacleTop + 5}px`;

            let yCarro = 555;

            if (obstacleTop + 50 >= yCarro && obstacleTop <= yCarro + 64 && Math.abs(x - parseInt(obstacle.style.left)) < 40) {
                if (obstacle.classList.contains('repair-kit')) {
                    playerLife = Math.min(playerLife + 50, 100);
                } else if (obstacle.classList.contains('type1')) {
                    playerLife -= 20;
                } else if (obstacle.classList.contains('type2')) {
                    playerLife -= 30;
                } else if (obstacle.classList.contains('type3')) {
                    playerLife -= 40;
                }
                playerLifeDisplay.textContent = `Vida: ${playerLife}`;

                if (playerLife <= 0) {
                    isGameOver = true;
                    alert('Fim de jogo!');
                    window.location.href = 'inicio.html';
                }

                obstacle.remove();
            }
        }
    });
}

function gameLoop() {
    if (!isGameOver) {
        moveObstacles();
        if (Math.random() < 0.02) {
            createObstacle();
        }
        if (Math.random() < 0.001) {
            createRepairKit();
        }
        requestAnimationFrame(gameLoop);
    }
}

fetchCharacterRecord();
updateCountdown();

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        spaceSound.play();
    }
});
