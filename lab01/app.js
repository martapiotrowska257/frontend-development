// fetchData();

async function fetchData() {
    const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
    const pokemonListDiv = document.getElementById("pokemonList");
    const imgElement = document.getElementById("pokemonSprite")

    try {

        // clear previous data and show loading indicator
        pokemonListDiv.innerHTML = "Loading...";
        imgElement.style.display = "none";


        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if (!response.ok) {
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();

        imgElement.src = data.sprites.front_default;
        imgElement.style.display = "block";


        pokemonListDiv.innerHTML = `
            <h2>${data.name}</h2>
            <p><strong>Type:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
            <p><strong>Height:</strong> ${data.height / 10} m</p>
            <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
            <h3>Base Stats:</h3>
            <ul>
                ${data.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join("")}
            </ul>
        `;

    }
    catch(error) {
        pokemonListDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        console.error(error);
    }
}

async function fetchPokemonList() {
    const pokemonListDiv = document.getElementById("pokemonList");

    try {
        // Show loading indicator
        pokemonListDiv.innerHTML = "Loading...";

        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        if (!response.ok) {
            throw new Error("Could not fetch Pokémon list");
        }

        const data = await response.json();

        // Display Pokémon list
        pokemonListDiv.innerHTML = data.results
            .map((pokemon, index) => `
                <div class="pokemon-card" onclick="fetchPokemonDetails('${pokemon.name}')">
                    <p>${index + 1}. ${pokemon.name}</p>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png" alt="${pokemon.name}">
                </div>
            `)
            .join("");
    } catch (error) {
        pokemonListDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
        console.error(error);
    }
}

async function fetchPokemonDetails(name) {
    const pokemonNameInput = document.getElementById("pokemonName");
    pokemonNameInput.value = name; // Autofill input with the selected name
    await fetchData();
}


fetchPokemonList();

