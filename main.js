document.addEventListener('DOMContentLoaded', () => {
    // Função para obter o valor de um parâmetro específico na URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Obtém o parâmetro "img" da URL
    const imgParam = getQueryParam('img');

    // Se o parâmetro "img" estiver presente, atualiza a imagem no canvas
    if (imgParam) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Define o tamanho do canvas
        canvas.width = 800;
        canvas.height = 600;

        const image = new Image();
        image.src = `/imagens/${imgParam}.png`;

        image.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Desenha a nova imagem
        };

        image.onerror = function() {
            console.error('Erro ao carregar a imagem:', image.src);
        };
    }
});
