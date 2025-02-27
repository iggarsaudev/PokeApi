document.addEventListener("DOMContentLoaded", () => {
  iniciarJuego();

  // Escuchar evento del botón de reinicio
  document.querySelector(".game__restart-btn").addEventListener("click", reiniciarJuego);
});

let palabraActual = "";
let letrasAdivinadas = [];
const letrasDisponibles = "abcdefghijklmnopqrstuvwxyz".split("");

async function iniciarJuego() {
  const pokemon = await obtenerPokemonAleatorio();
  palabraActual = pokemon.name.toLowerCase();
  letrasAdivinadas = Array(palabraActual.length).fill("_");

  mostrarSilueta(pokemon.image);
  generarBotonesLetras();
  actualizarPalabraMostrada();
}

async function obtenerPokemonAleatorio() {
  try {
    const idAleatorio = Math.floor(Math.random() * 151) + 1; // Solo 1ª generación
    const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`);
    const datos = await respuesta.json();

    return {
      name: datos.name,
      image: datos.sprites.other["official-artwork"].front_default
    };
  } catch (error) {
    console.error("Error al obtener el Pokémon:", error);
  }
}

function mostrarSilueta(imagenUrl) {
  const imagenPokemon = document.querySelector(".game__pokemon-image");
  imagenPokemon.src = imagenUrl;
  imagenPokemon.classList.add("silueta"); // Clase CSS para convertirlo en silueta
}

function generarBotonesLetras() {
  const contenedorLetras = document.querySelector(".game__letters");
  contenedorLetras.innerHTML = ""; // Limpiar antes de generar

  letrasDisponibles.forEach((letra) => {
    const boton = document.createElement("button");
    boton.textContent = letra.toUpperCase();
    boton.classList.add("game__letter");
    boton.addEventListener("click", () => manejarAdivinanza(letra, boton));
    contenedorLetras.appendChild(boton);
  });
}

function manejarAdivinanza(letra, boton) {
  boton.disabled = true; // Desactivar botón tras pulsarlo

  if (palabraActual.includes(letra)) {
    palabraActual.split("").forEach((char, index) => {
      if (char === letra) {
        letrasAdivinadas[index] = letra.toUpperCase();
      }
    });

    actualizarPalabraMostrada();

    if (!letrasAdivinadas.includes("_")) {
      mostrarMensaje("¡Has ganado! Era " + palabraActual.toUpperCase());
      revelarPokemon();
    }
  } else {
    manejarFallo();
  }
}

function actualizarPalabraMostrada() {
  document.querySelector(".game__word-display").textContent = letrasAdivinadas.join(" ");
}

function mostrarMensaje(mensaje) {
  document.querySelector(".game__status-message").textContent = mensaje;
}

function revelarPokemon() {
  const pokemonImage = document.querySelector(".game__pokemon-image");
  pokemonImage.classList.remove("silueta");
  pokemonImage.classList.add("revelado"); // Aplica la clase final sin flash
}

const maxErrores = 6;
let errores = 0;

// Función para actualizar la imagen del ahorcado según los errores
function actualizarAhorcado() {
  const ahorcadoImg = document.querySelector(".game__ahorcado-img");
  ahorcadoImg.src = `../assets/img/${errores}.png`;
}

// Función que se ejecuta cuando el jugador falla una letra
function manejarFallo() {
  if (errores < maxErrores) {
    errores++; // Aumentamos el contador de errores
    actualizarAhorcado(); // Cambiamos la imagen
  }

  if (errores === maxErrores) {
    // Si llegó al máximo de fallos, mostrar mensaje de derrota
    mostrarMensaje("¡Has perdido! El Pokémon era " + palabraActual.toUpperCase());
    revelarPokemon();
    deshabilitarLetras();
  }
}

function deshabilitarLetras() {
  document.querySelectorAll(".game__letter").forEach((boton) => {
    boton.disabled = true;
  });
}

function reiniciarJuego() {
  errores = 0; // Reiniciar errores
  letrasAdivinadas = []; // Vaciar letras adivinadas
  document.querySelector(".game__status-message").textContent = ""; // Limpiar mensaje
  document.querySelector(".game__ahorcado-img").src = "../assets/img/0.png"; // Resetear imagen del ahorcado
  
  // Obtener la imagen del Pokémon y restablecer su estado
  const imagenPokemon = document.querySelector(".game__pokemon-image");
  imagenPokemon.src = ""; // Se limpia la imagen para evitar el flash
  imagenPokemon.classList.remove("revelado"); // Se elimina la clase que lo muestra completamente
  imagenPokemon.classList.add("silueta"); // Se vuelve a aplicar la silueta

  // Restablecer letras disponibles
  document.querySelector(".game__letters").innerHTML = "";

  iniciarJuego(); // Volver a empezar el juego  
}