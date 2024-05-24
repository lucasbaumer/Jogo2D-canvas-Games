import {toRad} from "../engine/math.mjs";
import {animate} from "../engine/animation.mjs";
import {down} from "../engine/input.mjs";


const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const SPEED = 150; // Velocidade da bola

let x = canvas.width / 2; // Posição inicial da bola
let y = canvas.height /  1.21; // Posição inicial da bola
let velocity = SPEED;

// Função para obter o valor de um parâmetro específico na URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Obtém o parâmetro "img" da URL
let imgParam = getQueryParam('PresonagemSelecionado');
console.log('imgParam:', imgParam);

let imagePath = "./imagens/AmigoBleze_" + imgParam + ".jpg";
console.log('imagePath:', imagePath);

const image = new Image();
image.src = imagePath;

// Espera o carregamento da imagem
image.onload = function() {
    console.log('Imagem carregada:', imagePath);
    // Inicie a animação somente após a imagem ser carregada
    animate(canvas, {update, draw});
};

function update(time) {
    if (down('ArrowLeft') && x > 69.5 ) x -= velocity * time;
    else if (down('ArrowRight') && x <= canvas.width - 8.5) x += velocity * time;
    console.log(`Posição atualizada: x=${x}, y=${y}`);
}

function draw(ctx) {
    // Limpe o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhe a imagem na posição da bola preta, se a imagem estiver carregada
    if (image.complete) {
        console.log('Desenhando a imagem');
        ctx.drawImage(image, x - 72.5, y , 85, 22); 
    } else {
        console.log('Imagem não carregada ainda');
    }
}

// Verifique se o código de animação está sendo chamado
console.log('Script carregado');
