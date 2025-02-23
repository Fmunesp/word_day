let fila = 0;
let columna = 0; 
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

fetch("https://random-word-api.herokuapp.com/word?lang=es&length=5")
  .then((data) => data.json())
  .then((word) => {
    main(word);
  })
  .catch((error) => console.error("Error:", error));

const crearTablero = (mainContainer) => {
  // rellenamos el tablero
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

const crearTeclado = (container) => {
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

const tratarFila = (fila, palabraUsuario, palabra) => {
  if (palabraUsuario === palabra) {
    for (let i = 0; i < 5; i++) {
      document.getElementById(`input_${fila}_${i}`).style.backgroundColor =
        "green";
    }
    window.location.href = "../winner.html";
    return;
  }

  let palabraArray = palabra.split("");
  let palabraUsuarioArray = palabraUsuario.split("");
  let colorLetras = [];

  for (let i = 0; i < 5; i++) {
    if (palabraArray[i] === palabraUsuarioArray[i]) {
      colorLetras.push("green");
      document.getElementById(`word_${palabraUsuarioArray[i]}`).style.backgroundColor = "green";
    } else {
      if (palabraArray.includes(palabraUsuarioArray[i])) {
        colorLetras.push("yellow");
        document.getElementById(`word_${palabraUsuarioArray[i]}`).style.backgroundColor = "yellow";
      } else {
        colorLetras.push("red");
        document.getElementById(`word_${palabraUsuarioArray[i]}`).style.backgroundColor = "black";
        document.getElementById(`word_${palabraUsuarioArray[i]}`).disable = true;
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    document.getElementById(`input_${fila}_${i}`).style.backgroundColor =
      colorLetras[i];
  }

  if (fila === 5) {
    window.location.href = "../loser.html";
    return;
  }
};

const toggleInput = (fila) => {
  let filaAnterior = fila - 1;
  for (let i = 0; i < 5; i++) {
    document.getElementById(`input_${filaAnterior}_${i}`).disabled = true;
    let filaAct = document.getElementById(`input_${fila}_${i}`);
    filaAct.disabled = false;
    if (i === 0) {
      filaAct.focus();
    }
    
  }
  columna = 0;
};

const logicaTablero = (palabra) => {
  let palabraUsuario = "";
  for (let i = 0; i < 5; i++) {
    if (document.getElementById(`input_${fila}_${i}`).value === "") {
      alert("Por favor, rellene todos los campos");
      return;
    }
    palabraUsuario += document.getElementById(`input_${fila}_${i}`).value;
  }

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
  console.log(palabra[0]);
  localStorage.setItem("palabra", palabra[0]);
  const mainContainer = document.getElementById("main_container");
  crearTablero(mainContainer);

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

  document.getElementById("word_BK").addEventListener("click", (event) => {
    borrarFila(fila);
  });

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
