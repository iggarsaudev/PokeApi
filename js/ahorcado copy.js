let pokemonData = [];
let selectedPokemon = {};
let guessedLetters = []; // Almacena las letras adivinadas
let incorrectGuesses = 0; // Contador de adivinaciones incorrectas
const maxIncorrectGuesses = 6; // Número máximo de intentos incorrectos

// Obtener Pokémon de la API
function obtenerPokemon() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=1")
    .then(response => response.json())
    .then(data => {
      pokemonData = data.results;
    })
    .catch(error => console.error("Error al obtener Pokémon:", error));
}

// Iniciar el juego
function iniciarJuego() {
  guessedLetters = [];
  incorrectGuesses = 0;
  const randomPokemon = pokemonData[Math.floor(Math.random() * pokemonData.length)];
  const pokemonName = randomPokemon.name;

  // Obtener detalles del Pokémon
  fetch(randomPokemon.url)
    .then(response => response.json())
    .then(pokemon => {
      selectedPokemon = pokemon;
      mostrarSilhouette(pokemon.id);
      mostrarPalabra(pokemonName);
      crearLetras(pokemonName);
      actualizarEstado("¡Empieza a adivinar las letras!");
    });
}

// Mostrar la silueta del Pokémon
function mostrarSilhouette(pokemonId) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`; // Imagen del Pokémon
  const silhouetteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`; // Silueta o "back"
  document.getElementById("pokemon-image").src = imageUrl;
}

// Mostrar la palabra oculta (guiones bajos)
function mostrarPalabra(pokemonName) {
  const wordContainer = document.getElementById("word-to-guess");
  wordContainer.innerHTML = pokemonName.split("").map(letter => "_").join(" ");
}

// Crear las letras del abecedario para que el jugador haga clic
function crearLetras(pokemonName) {
  const alphabetContainer = document.getElementById("alphabet");
  alphabetContainer.innerHTML = "";

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  alphabet.forEach(letter => {
    const button = document.createElement("button");
    button.textContent = letter;
    button.onclick = () => adivinarLetra(letter, pokemonName);
    alphabetContainer.appendChild(button);
  });
}

// Función para adivinar una letra
function adivinarLetra(letter, pokemonName) {
    // Verificar si la letra ya ha sido adivinada
    if (guessedLetters.includes(letter)) return;  // Salir si ya está adivinada
  
    guessedLetters.push(letter); // Añadir la letra adivinada
  
    // Verificar si la letra está en el nombre del Pokémon
    if (pokemonName.includes(letter)) {
      mostrarPalabra(pokemonName); // Actualizar la palabra mostrada
      if (completarPalabra(pokemonName)) {
        actualizarEstado("¡Has adivinado el Pokémon!"); // Si la palabra está completa
      }
    } else {
      incorrectGuesses++; // Aumentar el contador de intentos incorrectos
      dibujarAhorcado(); // Dibujar el siguiente paso del ahorcado
      if (incorrectGuesses === maxIncorrectGuesses) {
        actualizarEstado("¡Has perdido! El Pokémon era " + pokemonName); // Si se alcanzan los intentos máximos
      }
    }
  }

// Comprobar si la palabra ha sido completada
function completarPalabra(pokemonName) {
  const wordContainer = document.getElementById("word-to-guess");
  const wordArray = wordContainer.textContent.split(" ");
  return wordArray.join("") === pokemonName;
}

// Dibujar el ahorcado
function dibujarAhorcado() {
  const hangmanContainer = document.getElementById("hangman");
  const stages = [
    "O", // Cabeza
    "|", // Cuerpo
    "/", "\\", // Brazos
    "/", "\\" // Piernas
  ];
  
  hangmanContainer.innerHTML = stages.slice(0, incorrectGuesses).join(" ");
}

// Actualizar el estado del juego
function actualizarEstado(message) {
  document.getElementById("status").textContent = message;
}

// Iniciar el juego al hacer clic en el botón
document.getElementById("start-button").onclick = iniciarJuego;

// Llamada inicial para obtener los Pokémon
obtenerPokemon();
