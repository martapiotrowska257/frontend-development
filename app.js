// Komponent wyświetlający listę Pokémonów
function PokemonList({ pokemons, onSelectPokemon }) {
    return (
        <div className="pokemon-list">
            {pokemons.map((pokemon, index) => (
                <div
                    key={pokemon.name}
                    className="pokemon-card"
                    onClick={() => onSelectPokemon(pokemon.name)}
                >
                    <p>{index + 1}. {pokemon.name}</p>
                    <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
                        alt={pokemon.name}
                    />
                </div>
            ))}
        </div>
    );
}

// Komponent wyświetlający szczegóły wybranego Pokémona
function PokemonDetails({ selectedPokemon }) {
    if (!selectedPokemon) {
        return <p>Select a Pokémon to see details or search for one.</p>;
    }

    return (
        <div>
            <h2>{selectedPokemon.name}</h2>
            <p><strong>Type:</strong> {selectedPokemon.types.map(t => t.type.name).join(", ")}</p>
            <p><strong>Height:</strong> {selectedPokemon.height / 10} m</p>
            <p><strong>Weight:</strong> {selectedPokemon.weight / 10} kg</p>
            <h3>Base Stats:</h3>
            <ul>
                {selectedPokemon.stats.map(stat => (
                    <li key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</li>
                ))}
            </ul>
            <div className="image">
                <img
                    src={selectedPokemon.sprites.front_default}
                    alt={selectedPokemon.name}
                />
            </div>
        </div>
    );
}

// Główny komponent aplikacji
function App() {
    let pokemonList = [];
    let selectedPokemon = null;

    // Funkcja pobierająca listę Pokémonów
    async function fetchPokemonList() {
        try {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
            if (!response.ok) {
                throw new Error("Could not fetch Pokémon list");
            }
            const data = await response.json();
            pokemonList = data.results;
            renderApp(); // Re-renderuj aplikację po zaktualizowaniu danych
        } catch (error) {
            console.error(error);
            pokemonList = [];
            renderApp();
        }
    }

    // Funkcja pobierająca szczegóły wybranego Pokémona
    async function fetchPokemonDetails(name) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!response.ok) {
                throw new Error("Could not fetch Pokémon details");
            }
            const data = await response.json();
            selectedPokemon = data;
            renderApp(); // Re-renderuj aplikację po zaktualizowaniu szczegółów
        } catch (error) {
            console.error(error);
            selectedPokemon = null;
            renderApp();
        }
    }

    // Funkcja do wyszukiwania Pokémona na podstawie nazwy
    async function fetchData() {
        const searchTerm = document.getElementById("pokemonName").value.toLowerCase();

        if (!searchTerm) {
            selectedPokemon = null;
            renderApp(); // Jeśli nic nie wpisano, pokazujemy listę Pokémonów
            return;
        }

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            if (!response.ok) {
                throw new Error("Could not fetch resource");
            }

            const data = await response.json();
            selectedPokemon = data; // Ustawiamy dane wybranego Pokémona
            renderApp(); // Re-renderuj aplikację z nowymi danymi
        } catch (error) {
            console.error(error);
            selectedPokemon = null;
            renderApp();
        }
    }

    // Funkcja do renderowania aplikacji
    function renderApp() {
        ReactDOM.render(
            <div>
                <header>
                    <h1>Find Your Pokémon!</h1>
                </header>
                <main>
                    <section className="search-section">
                        <div className="search-button">
                            <input type="text" id="pokemonName" placeholder="Enter Pokemon name" />
                            <button onClick={fetchData}>Fetch Pokemon</button><br />
                        </div>
                    </section>
                    <section className="pokemon-display">
                        {/* Jeśli wyszukujesz Pokémona, nie wyświetlamy listy */}
                        {!selectedPokemon && (
                            <PokemonList
                                pokemons={pokemonList}
                                onSelectPokemon={fetchPokemonDetails} // Wyświetlanie szczegółów po kliknięciu
                            />
                        )}
                        <PokemonDetails selectedPokemon={selectedPokemon} />
                    </section>
                </main>
            </div>,
            document.getElementById('root')
        );
    }

    // Na starcie pobierz listę Pokémonów
    fetchPokemonList();

    return null; // Główny komponent nie renderuje niczego, ponieważ ReactDOM.render zarządza wszystkim
}

// Uruchom aplikację
App();
