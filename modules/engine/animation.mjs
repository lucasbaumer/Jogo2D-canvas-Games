import {_keyboard_listen} from "./input.mjs";

export function animate(canvas, {update = undefined, draw = undefined} = {}) {
    if (!canvas.getContext) {
        alert("Canvas não disponível!");
        return;
    }

    _keyboard_listen();

    const ctx = canvas.getContext('2d');
    let lastFrameTime = 0;

    function onFrame(time) {
        //Não temos como calcular a diferença de tempo entre dois quadros no primeiro quadro
        //Por isso, se for ele (lastFrameTime === 0) pulamos ele sem desenhar
        if (lastFrameTime !== 0) {
            //Calculamos o tempo transcorrido, em segundos
            const elapsed = (time - lastFrameTime) / 1000;
            if (update) update(elapsed); //Atualizamos a lógica

            //Desenhamos
            ctx.save();
            if (draw) draw(ctx);
            ctx.restore();
        }
        //Guardamos o tempo desse quadro para usar no próximo desenho
        lastFrameTime = time;
        //Solicitamos o próximo quadro
        window.requestAnimationFrame(onFrame);
    }

    //Solicita o primeiro quadro
    window.requestAnimationFrame(onFrame);
}
