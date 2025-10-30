console.log('tot ok');


const url = "https://pokeapi.co/api/v2/";

window.onload = async () => {
    const pokemons = await fetchPokemons();
    const pokedex = document.getElementById('pokedex');

    for (const pokemon of pokemons) {
        const pokemonUrl = pokemon.url;
        const pokemonData = await fetchPokemonsData(pokemonUrl);


        const pokemonDiv = document.createElement('div');
        pokemonDiv.className = 'pokemon';

        const pokemonName = document.createElement('h3');
        pokemonName.innerText = pokemonData.name;
        pokemonDiv.appendChild(pokemonName);

        const pokemonImg = document.createElement('img');
        pokemonImg.src = pokemonData.sprites.front_default;
        pokemonImg.className = 'pokemon-img';
        pokemonImg.style.display = 'block';
        pokemonDiv.appendChild(pokemonImg);

        const pokemonButton = document.createElement('button');
        pokemonButton.className = 'botonPokemon'
        pokemonButton.innerText = "Añadir";
        pokemonDiv.appendChild(pokemonButton);

        pokemonButton.onclick = async () => {
            pokemonButton.innerText = "Añadiendo....";
            const añadido = await añadirEquipo(pokemonData);
            if (añadido) {
                pokemonButton.style.backgroundColor = "rgb(128,128,128)";
                pokemonButton.innerText = "En tu equipo!!!";
            } else {
                alert("Equipo lleno!!!");
                pokemonButton.innerText = "Añadir";
            }
        }
        pokedex.appendChild(pokemonDiv);
    }
}

const miEquipo = [];

async function añadirEquipo(pokemonData) {
    const equipoUl = document.getElementById('equipo');
    if (miEquipo.length > 5) {
        return false;
    } else {
        miEquipo.push(pokemonData);
        actualizarEquipo();
        return true;
    }

}

function actualizarEquipo() {
    const equipoUl = document.getElementById('equipo');
    equipoUl.innerHTML = '';

    for (let pokemon of miEquipo) {
        const pokemonDiv = document.createElement('li');

        const img = document.createElement('img');
        img.className = 'pokemon-img';
        img.src = pokemon.sprites.front_default;
        pokemonDiv.appendChild(img);

        const name = document.createElement('p');
        name.innerText = pokemon.name;
        pokemonDiv.appendChild(name);

        pokemonDiv.onclick = () => eliminarPokemon(pokemon.name);

        equipoUl.appendChild(pokemonDiv);
    }
}

function eliminarPokemon(nombre) {
    let i = 0;
    for (let pokemon of miEquipo) {

        if (pokemon.name === nombre) {
            miEquipo.splice(i, 1);
            actualizarEquipo();
            break;
        }
        i++;
    }
}

async function fetchPokemons() {
    const response = await fetch(`${url}pokemon/?limit=99`);
    const data = await response.json();
    const pokemonList = data.results;
    return pokemonList;
}

async function fetchPokemonsData(pokemonUrl) {
    const response = await fetch(pokemonUrl);
    const data = await response.json();
    return data;
}

async function searchPokemon(name) {
    try {
        const response = await fetch(`${url}pokemon/${name}`);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();
        return data;
    } catch (error) {
        return null;
    }
}

async function searchPokemonByName(event) {
    event.preventDefault();

    const input = document.getElementById('inputPokemon');
    const busqueda = document.getElementById('busqueda');
    const pokemonName = input.value;
    const pokemonSearch = await searchPokemon(pokemonName);
    if (pokemonSearch) {
        busqueda.innerHTML = '';
        let tipos = '';
        for (let i = 0; i < pokemonSearch.types.length; i++) {
            tipos += pokemonSearch.types[i].type.name;
            if (i < pokemonSearch.types.length - 1) {
                tipos += ', ';
            }
        }
        busqueda.innerText = `ID: ${pokemonSearch.id} Tipo: ${tipos}`;
        const img = document.createElement('img');
        img.className = 'imagen-search';
        img.src = pokemonSearch.sprites.other['official-artwork'].front_default;
        busqueda.appendChild(img);
    } else {
        busqueda.innerText = "No se ha encontrado tu pokemon."
    }
    return busqueda.innerText;
}
