import { tipoColores } from '../assets/data/coloresPokemon.js'

let offset = 0;
const limit = 15;

function obtenerPokemon(offset, limit) {
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then(response => response.json())
    .then(data => {
      mostrarPokemon(data.results);
    })
    .catch(error => console.error("Error:", error));
}

async function obtenerTipoEnEspañol(tipoUrl) {
  return fetch(tipoUrl)
    .then(response => response.json())
    .then(tipoData => {
      const idioma = tipoData.names.find(name => name.language.name === "es");
      return idioma ? idioma.name : tipoData.name; // Si no encuentra el tipo en español, devuelve el tipo en inglés
    })
    .catch(error => {
      console.error("Error al obtener el tipo en español:", error);
      return ""; // Retorna una cadena vacía si falla
    });
}

function mostrarPokemon(pokemonList) {
  const contenedor = document.getElementById("pokemon-container");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  // Usamos un array de promesas que se resolverán en el orden correcto
  const pokemonPromises = pokemonList.map((pokemon, index) => {
    const pokemonId = offset + index + 1; // Calcular ID real
    const formattedId = String(pokemonId).padStart(4, '0'); // Formatear el id para que tenga 4 dígitos
    const pokemonImgFront = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    const pokemonImgBack = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonId}.png`;

    // Hacer la solicitud para obtener el tipo del Pokémon
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
      .then(response => response.json())
      .then(pokemonData => {
        // Obtener los tipos de Pokémon y traducirlos a español
        const tipoPromises = pokemonData.types.map(tipo => obtenerTipoEnEspañol(tipo.type.url));

        return Promise.all(tipoPromises).then(tipoNames => {          
          const pokemonTypes = tipoNames.map(tipo => {
            // Convertir a minúsculas para asegurar coincidencia con el objeto tipoColores
            const color = tipoColores[tipo.toLowerCase()] || "#E0E0E0"; // Color por defecto si el tipo no está definido
            return `<span class="pokemon-type" style="background-color: ${color};">${tipo}</span>`;
          }).join(''); // Crear los tags para los tipos

          // Crear la tarjeta con el carrusel y mostrar el tipo como tags
          const card = document.createElement("div");
          card.classList.add("pokemon-card");

          card.innerHTML = `
            <div id="carousel-${formattedId}" class="carousel slide">
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img src="${pokemonImgFront}" class="d-block w-100 pokemon-img" alt="${pokemon.name}" aria-label="${pokemon.name}">
                </div>
                <div class="carousel-item">
                  <img src="${pokemonImgBack}" class="d-block w-100 pokemon-img" alt="${pokemon.name}" aria-label="${pokemon.name}">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${formattedId}" data-bs-slide="prev">
                <span class="material-symbols-outlined btn-carousel">arrow_left</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carousel-${formattedId}" data-bs-slide="next">
                <span class="material-symbols-outlined btn-carousel">arrow_right</span>
              </button>
            </div>
            <h3 class="pokemon-name">${pokemon.name}</h3>
            <h3 class="pokemon-num">Nº ${formattedId}</h3>
            <div class="pokemon-types">${pokemonTypes}</div>
          `;

          return card; // Devolver la tarjeta para que se agregue en orden
        });
      })
      .catch(error => console.error("Error fetching details for Pokémon:", error));
  });

  // Una vez que todas las promesas se hayan resuelto, añadimos las tarjetas en el orden correcto
  Promise.all(pokemonPromises)
    .then(pokemonCards => {
      pokemonCards.forEach(card => {
        contenedor.appendChild(card); // Agregar las tarjetas en el orden original
      });
    })
    .catch(error => console.error("Error al cargar los Pokémon:", error));
}

// Botones para paginación
document.getElementById("btn-siguiente").addEventListener("click", () => {
  offset += limit;
  obtenerPokemon(offset, limit);
});

document.getElementById("btn-anterior").addEventListener("click", () => {
  if (offset >= limit) {
    offset -= limit;
    obtenerPokemon(offset, limit);
  }
});

// Llamada inicial
obtenerPokemon(offset, limit);
