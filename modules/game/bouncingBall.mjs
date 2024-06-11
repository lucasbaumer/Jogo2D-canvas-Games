document.addEventListener('DOMContentLoaded', (event) => {
    const popup = document.getElementById('popup');
    const countdownElement = document.getElementById('countdown');
    const countdownSound = document.getElementById('countdown-sound');
    const spaceSound = document.getElementById('space-sound');
    const backgroundMusic = document.getElementById('background-music');
    let countdown = 3;
    let score = 0;
    const scoreDisplay = document.getElementById('player-score'); // Elemento DOM que exibe a pontuação

    function startGame() {
        popup.style.display = 'none';
        backgroundMusic.play(); // Inicia a música de fundo
        gameLoop();
        updateScore(); // Inicia a atualização da pontuação
    }

    function updateCountdown() {
        if (countdown > 0) {
            countdownElement.textContent = 'Começando em ' + countdown + ' segundos...'; 
            countdownSound.play();
            countdown--;
            setTimeout(updateCountdown, 1000);
        } else {
            countdownElement.textContent = "Vai!!";
            setTimeout(startGame, 1000);
        }
    }

    function updateScore() {
        score++;
        scoreDisplay.textContent = `Pontos: ${score}`;
        if (!isGameOver) {
            setTimeout(updateScore, 1000); // Atualiza a pontuação a cada segundo
        }
        if(isGameOver){
            alert('Você conseguiu ' + (score - 1) + ' pontos' )
        }
    }

    updateCountdown();

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            spaceSound.play();
        }
    });
});

// Restante do código de animação e jogo
// ...

import { animate } from "../engine/animation.mjs";
import { down } from "../engine/input.mjs";

// Seleciona o elemento canvas do DOM e obtém o contexto de renderização 2D
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// Define a velocidade do carro e sua posição inicial
const SPEED = 150; // Velocidade do carro
let x = canvas.width / 2; // Posição inicial horizontal do carro
let y = canvas.height * 0.8; // Posição inicial vertical do carro (80% da altura do canvas)
let velocity = SPEED; // Inicializa a velocidade
let isGameOver = false; // Estado do jogo (inicialmente não terminado)
let playerLife = 100; // Vida inicial do jogador
const playerLifeDisplay = document.getElementById('player-life'); // Elemento DOM que exibe a vida do jogador

// Função para obter o valor de um parâmetro específico na URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Obtém o parâmetro "img" da URL, que indica o personagem selecionado
let imgParam = getQueryParam('PresonagemSelecionado');
console.log('imgParam:', imgParam);

// Define o caminho da imagem do personagem selecionado
let imagePath = "./imagens/ImagenJogo_" + imgParam + ".png";
console.log('imagePath:', imagePath);

// Cria um novo objeto de imagem e define seu caminho de origem
const image = new Image();
image.src = imagePath;

// Espera o carregamento da imagem e, em seguida, inicia a animação
image.onload = function() {
    console.log('Imagem carregada:', imagePath);
    animate(canvas, { update, draw }); // Inicia a animação após o carregamento da imagem
};

// Função de atualização para movimentar o carro
function update(time) {
    // Move o carro para a esquerda se a tecla de seta esquerda estiver pressionada
    if (down('ArrowLeft') && x > 69.5) x -= velocity * time;
    // Move o carro para a direita se a tecla de seta direita estiver pressionada
    else if (down('ArrowRight') && x <= canvas.width - 8.5) x += velocity * time;
    // console.log(`Posição atualizada: x=${x}, y=${y}`);
}

// Função de desenho para renderizar o carro no canvas
function draw(ctx) {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a imagem do carro na posição atual, se a imagem estiver carregada
    if (image.complete) {
        ctx.drawImage(image, x - 72.5, y, 85, 22); // Desenha a imagem do carro
    } else {
        console.log('Imagem não carregada ainda');
    }
}

// Seleciona o contêiner de obstáculos do DOM
const obstaclesContainer = document.querySelector('#obstacles-container');

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    // Define o tipo de obstáculo aleatoriamente
    const type = Math.floor(Math.random() * 3) + 1; // Supondo 3 tipos diferentes de obstáculos
    obstacle.classList.add(`type${type}`);

    // Variáveis para armazenar a posição do novo obstáculo
    let newLeft;
    let isOverlapping;

    // Loop para garantir que o novo obstáculo não se sobreponha aos existentes
    do {
        // Gera uma nova posição para o obstáculo
        newLeft = Math.floor(Math.random() * (canvas.width + 0));
        obstacle.style.left = newLeft + 'px';
        obstacle.style.top = '0px'; // Inicializa o topo do obstáculo

        // Verifica se há sobreposição com outros obstáculos
        isOverlapping = Array.from(document.querySelectorAll('.obstacle')).some(existingObstacle => {
            const existingLeft = parseInt(existingObstacle.style.left);
            const existingTop = parseInt(existingObstacle.style.top);
            return Math.abs(existingLeft - newLeft) < 50 && Math.abs(existingTop - 0) < 50;
        });
    } while (isOverlapping);

    obstaclesContainer.appendChild(obstacle); // Adiciona o obstáculo ao contêiner
    console.log('Obstáculo criado, tipo:', type);
}

// Função para criar um novo kit de reparo
function createRepairKit() {
    const repairKit = document.createElement('div');
    repairKit.classList.add('repair-kit');
    
    // Define a posição inicial do kit de reparo
    repairKit.style.left = Math.floor(Math.random() * (canvas.width - 50)) + 'px';
    repairKit.style.top = '0px'; // Inicializa o topo do kit de reparo
    obstaclesContainer.appendChild(repairKit); // Adiciona o kit de reparo ao contêiner
}

// Função para mover obstáculos e kits de reparo
function moveObstacles() {
    const obstacles = document.querySelectorAll('.obstacle, .repair-kit');
    obstacles.forEach(obstacle => {
        // Obtém a posição vertical atual do obstáculo
        let obstacleTop = parseInt(window.getComputedStyle(obstacle).getPropertyValue('top'));
        
        // Remove o obstáculo se ele ultrapassar a parte inferior do canvas
        if (obstacleTop >= canvas.offsetHeight) {
            obstacle.remove();
        } else {
            // Move o obstáculo para baixo
            obstacle.style.top = obstacleTop + 6 + 'px';
            
            // Atualiza dinamicamente a posição y do carro
            let yCarro = 555; // Posição atual do carro

            // Verifica a colisão com o carro
            if (obstacleTop + 50 >= yCarro && obstacleTop <= yCarro + 52 && Math.abs(x - parseInt(obstacle.style.left)) < 40) {
                if (obstacle.classList.contains('repair-kit')) {
                    // Kit de reparo: aumenta a vida do jogador
                    playerLife = Math.min(playerLife + 50, 100); // Aumenta a vida, mas não passa de 100
                } else if (obstacle.classList.contains('type1')) {
                    // Tipo de obstáculo 1: diminui a vida do jogador
                    playerLife -= 20;
                } else if (obstacle.classList.contains('type2')) {
                    // Tipo de obstáculo 2: diminui a vida do jogador mais significativamente
                    playerLife -= 30;
                } else if (obstacle.classList.contains('type3')) {
                    // Tipo de obstáculo 3: outro efeito (exemplo)
                    playerLife -= 40;
                }
                playerLifeDisplay.textContent = `Vida: ${playerLife}`; // Atualiza a exibição da vida do jogador

                // Verifica se a vida do jogador chegou a zero
                if (playerLife <= 0) {
                    isGameOver = true;
                    window.alert('Fim de jogo!');
                    window.location.href = "inicio.html"; // Redireciona para a página inicial
                }

                obstacle.remove(); // Remove o obstáculo após a colisão
            }
        }
    });
}

// Função principal do loop do jogo
function gameLoop() {
    if (!isGameOver) {
        moveObstacles(); // Move os obstáculos e kits de reparo
        if (Math.random() < 0.02) {
            createObstacle(); // Cria novos obstáculos com uma pequena chance a cada frame
        }
        if (Math.random() < 0.001) {
            createRepairKit(); // Cria novos kits de reparo com uma menor chance a cada frame
        }
        requestAnimationFrame(gameLoop); // Solicita o próximo frame da animação
    }
}
