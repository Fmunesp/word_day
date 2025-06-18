let fila = 0;
let columna = 0; 
    //Creamos una constante para el teclado
const qwerty = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "Ñ",
  "OK",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "⌫",
];

    // API de palabras  
fetch("https://random-word-api.herokuapp.com/word?lang=es&length=5")
  .then((data) => data.json())
  .then((word) => {
    main(word);
  })
  .catch((error) => console.error("Error:", error));

    //Constante para crear el tablero
const crearTablero = (mainContainer) => {
    // Rellenar el tablero columnas(i), filas(j)
  for (let i = 0; i < 6; i++) {
    let isDisabled = i === 0 ? "" : "disabled";
    mainContainer.innerHTML += `<div id="container_row_${i}" class="row">`;
    for (let j = 0; j < 5; j++) {
      let focus = j === 0 && i === 0 ? "autofocus" : "";
      mainContainer.innerHTML += `<input type="text" id="input_${i}_${j}" class="word_input" maxlength="1" ${isDisabled} ${focus} />`;
    }
    mainContainer.innerHTML += `</div>`;
  }
};

    //Constante para crear el teclado
const crearTeclado = (container) => {
    //"Creamos una copia del teclado para asi no modificar el original"
  let aux = [...qwerty];
  for (let i = 0; i < 3; i++) {
    let containerAux = `<div class="keyboard-row">`;
    for (let j = 0; j < 10; j++) {
      if (i === 2 && j === 8) {
        containerAux += `<span class="key" id="word_BK">${aux[j]}</span>`;
        break;
      }
      containerAux += `<span class="key" id="word_${aux[j]}">${aux[j]}</span>`;
    }
    containerAux += `</div>`;
    container.innerHTML += containerAux;
    aux.splice(0, 10);
  }
};

    //Constante para si la palabra de entrada es igual a la palabra correcta y que cambie de color
const tratarFila = (fila, palabraUsuario, palabra) => {
  if (palabraUsuario === palabra) {
    for (let i = 0; i < 5; i++) {
      document.getElementById(`input_${fila}_${i}`).style.backgroundColor =
        "green";
    }
    //Cambio de pantalla a victoria
    window.location.href = "../winner.html";
    return;
  }

  let palabraArray = palabra.split("");
  let palabraUsuarioArray = palabraUsuario.split("");
  let colorLetras = [];

    // Para recorrer las letras de la palabra de entrada
  for (let i = 0; i < 5; i++) {
       // Si la letra está en la posición correcta
    if (palabraArray[i] === palabraUsuarioArray[i]) {
      colorLetras.push("green");
      document.getElementById(`word_${palabraUsuarioArray[i]}`).style.backgroundColor = "green";
    } else {
        // Si la letra está en la palabra pero en otra posición
      if (palabraArray.includes(palabraUsuarioArray[i])) {
        colorLetras.push("yellow");
        document.getElementById(`word_${palabraUsuarioArray[i]}`).style.backgroundColor = "yellow";
      } else {
          // Si la letra no está en la palabra
        colorLetras.push("red");
        document.getElementById(`word_${palabraUsuarioArray[i]}`).style.backgroundColor = "black";
        document.getElementById(`word_${palabraUsuarioArray[i]}`).disable = true;
      }
    }
  }

    // Aplica los colores a las casillas de la fila actual
  for (let i = 0; i < 5; i++) {
    document.getElementById(`input_${fila}_${i}`).style.backgroundColor =
      colorLetras[i];
  }
    // Si hemos completado todas las filas y no hemos acertado nos manda a la pantalla de derrota
  if (fila === 5) {
    window.location.href = "../loser.html";
    return;
  }
};

    //Utilizamos esto para desactivar la fila anterior y activar la siguiente
const toggleInput = (fila) => {
  let filaAnterior = fila - 1;
  for (let i = 0; i < 5; i++) {
    document.getElementById(`input_${filaAnterior}_${i}`).disabled = true;
    let filaAct = document.getElementById(`input_${fila}_${i}`);
    filaAct.disabled = false;
    //Colocamos el foco en el primer recuadro de la fila actual
    if (i === 0) {
      filaAct.focus();  
    }
    
  }
  columna = 0;
};

    //Constante para comprobar la palabra ingresada por el usuario en la fila que estemos
const logicaTablero = (palabra) => {
  let palabraUsuario = "";
  for (let i = 0; i < 5; i++) {
    if (document.getElementById(`input_${fila}_${i}`).value === "") {
      alert("Por favor, rellene todos los campos");
      return;
    }
    palabraUsuario += document.getElementById(`input_${fila}_${i}`).value;
  }
    // Para saber que la palabra tenga 5 letras
  if (palabraUsuario.length !== 5) {
    alert("Por favor, rellene todos los campos");
    return;
  }
  console.log(palabraUsuario);
  tratarFila(fila, palabraUsuario, palabra[0].toUpperCase());

  fila++;
  toggleInput(fila);
};


const borrarFila = (fila) => {
  for (let i = 0; i < 5; i++) {
    let filaAct = document.getElementById(`input_${fila}_${i}`);
    filaAct.value = "";
    if (i === 0) {
      filaAct.focus();
    }
  }
}


const main = (palabra) => {
  // Muestra en consola la palabra seleccionada
  console.log(palabra[0]);
  // Almacena la primera palabra
  localStorage.setItem("palabra", palabra[0]);
  // Tiene el contenedor principal y crea el tablero del jego
  const mainContainer = document.getElementById("main_container");
  crearTablero(mainContainer);
  //Genera el teclado virtual
  const keyboardContainer = document.getElementById("keyboard_container");
  crearTeclado(keyboardContainer);

  // Evento para detectar si se ha pulsado una tecla distinta a una letra
  document.addEventListener("keydown", (event) => {
    const { key } = event;

    // Lista de teclas permitidas (excepciones)
    const teclasPermitidas = [
      "Backspace",
      "Tab",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Delete",
    ];

    // Si la tecla NO es una letra y NO está en la lista de teclas permitidas, bloquear
    if (!key.match(/^[a-zA-ZñÑ]$/) && !teclasPermitidas.includes(key)) {
      event.preventDefault(); // Evita que la tecla se escriba
    }
  });

  // evento para detectar si se ha introducido una letra
  document.addEventListener("keyup", (event) => {
    const { target, key } = event;

    if (key === "Enter") {
      logicaTablero(palabra);
    } else if (key === "Backspace") {
      borrarFila(fila);
    }else {
      target.value = key === "Backspace" ? "" : key.toUpperCase();
      let filaActual = target.id.split("_")[1];
      let inputActual = target.id.slice(-1);
      let nextInputNumber =
        Number(inputActual) >= 4 ? Number(inputActual) : Number(inputActual) + 1;
  
      let nextInput = document.getElementById(
        `input_${filaActual}_${nextInputNumber}`
      );
      nextInput.focus();
    }
  });

  // evento para detectar si se ha pulsado OK
  document.getElementById("word_OK").addEventListener("click", (event) => {
    logicaTablero(palabra);
  });

  // evento para el boton de borrar
  document.getElementById("word_BK").addEventListener("click", (event) => {
    borrarFila(fila);
  });

  // para controlar el teclado
  document.addEventListener("click", (event) => {
    const { target } = event;
    if (target.classList.contains("key") && target.id !== "word_OK" && target.id !== "word_BK") {
      let input = document.getElementById(`input_${fila}_${columna}`);
      if (input) {
        input.value = target.innerText;
        let filaActual = input.id.split("_")[1];
        let inputActual = input.id.slice(-1);
        let nextInputNumber =
          Number(inputActual) >= 4 ? Number(inputActual) : Number(inputActual) + 1;
    
        let nextInput = document.getElementById(
          `input_${filaActual}_${nextInputNumber}`
        );
        columna = nextInputNumber;
        nextInput.focus();
      }
    }
  });
};
