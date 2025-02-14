const qwerty = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ', 'OK' ,'Z', 'X', 'C', 'V', 'B', 'N', 'M','⌫'];

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

const crearTeclado = container => {
    let aux = [...qwerty];
    for(let i = 0; i < 3; i++) {
        let containerAux = `<div class="keyboard-row">`;
        for(let j = 0; j < 10; j++) {
            if(i === 2 && j === 8) {
                containerAux += `<span class="key" id="word_BK">${aux[j]}</span>`;
                break;
            }
            containerAux += `<span class="key" id="word_${aux[j]}">${aux[j]}</span>`;
        }
        containerAux += `</div>`;
        console.log(containerAux);
        container.innerHTML += containerAux;
        aux.splice(0, 10);
    }
}

// Una vez cargado el DOM, ejecutamos la función principal
document.addEventListener('DOMContentLoaded', () => {
    
    const mainContainer = document.getElementById('main_container');
    crearTablero(mainContainer);

    const keyboardContainer = document.getElementById('keyboard_container');
    crearTeclado(keyboardContainer);

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
