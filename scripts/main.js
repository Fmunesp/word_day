const crearTablero = (mainContainer) => {
    // rellenamos el tablero
    for (let i = 0; i < 6; i++) {
        let isDisabled = i === 0  ? '' : 'disabled';
        mainContainer.innerHTML += `<div id="container_row_${i}" class="row">`;
        for (let j = 0; j < 5; j++) {
            let focus = (j === 0 && i === 0) ? 'autofocus' : '';
            mainContainer.innerHTML += `<input type="text" id="input_${i}_${j}" class="word_input" maxlength="1" ${isDisabled} ${focus} />`;
        }
        mainContainer.innerHTML += `</div>`;
    }
}

// Una vez cargado el DOM, ejecutamos la función principal
document.addEventListener('DOMContentLoaded', () => {
    
    const mainContainer = document.getElementById('main_container');
    crearTablero(mainContainer);

    // Evento para detectar si se ha pulsado una tecla distinta a una letra
    document.addEventListener('keydown', event => {
        const { key } = event;
    
        // Lista de teclas permitidas (excepciones)
        const teclasPermitidas = ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete'];
    
        // Si la tecla NO es una letra y NO está en la lista de teclas permitidas, bloquear
        if (!key.match(/^[a-zA-ZñÑ]$/) && !teclasPermitidas.includes(key)) {
            console.log(`Tecla bloqueada: ${key}`);
            event.preventDefault(); // Evita que la tecla se escriba
        }
    });

    // evento para detectar si se ha introducido una letra
    document.addEventListener('keyup', event => {
        const { target, key } = event;
        let filaActual = target.id.split('_')[1];
        let inputActual = target.id.slice(-1);
        let nextInputNumber = Number(inputActual) >= 4 ? Number(inputActual) : Number(inputActual) + 1;

        let nextInput = document.getElementById(`input_${filaActual}_${nextInputNumber}`);
        nextInput.focus();
    });

});
