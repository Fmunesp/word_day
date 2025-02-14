const crearTablero = (mainContainer) => {
    // rellenamos el tablero
    for (let i = 0; i < 6; i++) {
        mainContainer.innerHTML += `<div id="container_row_${i}" class="row">`;
        for (let j = 0; j < 5; j++) {
            mainContainer.innerHTML += `<input type="text" id="input_${i}_${j}" class="word_input" maxlength="1">`;
        }
        mainContainer.innerHTML += `</div>`;
    }
}

// Una vez cargado el DOM, ejecutamos la función principal
document.addEventListener('DOMContentLoaded', () => {
    
    const mainContainer = document.getElementById('main_container');
    crearTablero(mainContainer);

});
