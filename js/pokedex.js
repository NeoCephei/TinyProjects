const pokeContainer = document.getElementById('poke-container');
const pokemonNumbers = 6 * 12;
let index;
const colors = {
    fire: '#ffa2a2',
    grass:  '#98d7a5',
    electric: '#fff0a3',
    water: '#ace5ff',
    ground: '#cf9c6a',
    rock: '#a1a1a1',
    fairy: '#f1c6f8',
    poison: '#cf7dff',
    bug: '#ccffcf',
    dragon: '#939be5',
    psychic: '#aca1bb',
    flying: '#F5F5F5',
    fighting: '#f0d092',
    normal: '#F5F5F5'
}
const mainTypes = Object.keys(colors);


const fetchPokemons = async () => {
    for (let i=1; i<=pokemonNumbers; i++){
        await getPokemon(i);
    }
}

const getPokemon = async id => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const pokemon = await fetch(url).then(res => res.json());
    
    createPokemonCard(pokemon);
}

const getPokemonData = async id => {

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    
    if (res.status === 200) {
        const pokemon = await res.json();
        index = id;
        createPokemonPokedexCard(pokemon);
    } else{
        console.log('Promise Error');
    }
    
}

fetchPokemons();


function createPokemonCard(pokemon) {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');
    pokemonEl.id = pokemon.id;

    const pokeType = pokemon.types.map(el => el.type.name);
    const type = pokeType[0];
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const imgURL = pokemon.sprites.front_default;
    const color = colors[type];

    pokemonEl.style.backgroundColor = color;

    const pokeInnerHTML = `
        <div class='img-container' onclick = 'openPokemonCard(event)'>
            <img class='poke-img' src="${imgURL}" />
        </div>
        <div class='info'>
            <span class = 'number'>#${pokemon.id.toString().padStart(3,'0')}<span>
            <h3 class = 'name'>${name}</h3>
            <small class = 'type">Type: <span>${type}</span></small>
        </div>
    `;

    pokemonEl.innerHTML = pokeInnerHTML;

    pokeContainer.appendChild(pokemonEl);
}

function openPokemonCard(event){
    let idPokemon;
    event.target.classList[0].includes('poke-img') ? idPokemon = event.target.parentNode.parentNode.id : idPokemon = event.target.parentNode.id;
    getPokemonData(idPokemon);
}

function createPokemonPokedexCard(pokemon){

    let pokedexInfo = document.getElementById('open-pokedex');
    pokedexInfo.innerHTML = "";
    pokedexInfo.classList.remove('hide');

    const number = '#'+pokemon.id.toString().padStart(3,'0');
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const type = pokemon.types[0].type.name;
    const color = colors[type];
    const frontPictureURL = pokemon.sprites.other.dream_world.front_default;
    const picturesURL = [
        pokemon.sprites.front_default,
        pokemon.sprites.back_default,
        pokemon.sprites.front_shiny,
        pokemon.sprites.back_shiny
    ];

    // console.log(type);

    Object.assign(pokedexInfo.style,{
        backgroundColor : color,
        borderRadius : '30px',
        opacity : '0.95'
    });

    const pokeInnerHTML = `
        <div class = 'pokeBasicInfo'>
            <div class = 'pokeImgContainer'>
                <img class = "pokeFrontPicture" src = "${frontPictureURL}" />
            </div>
            <div class = 'icon ${type}'>
                <img src = '../img/pokedex/${type}.svg' />
            </div>
            <div class = 'pokeInfoContainer'>
                <div class = 'pokeName'>
                    <p>${number} ${name}</p>
                </div>
                <div class = 'pokeInfo'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam sem et tortor consequat id porta nibh venenatis. Sapien et ligula ullamcorper malesuada proin libero nunc consequat interdum. Praesent semper feugiat nibh sed pulvinar proin gravida hendrerit.
                </div>
            </div>
        </div>
        <div class = 'pokeDefaultImg'>
            <img class = "pokeDefaultPicture" src = "${picturesURL[0]}" />
            <img class = "pokeDefaultPicture" src = "${picturesURL[1]}" />
            <img class = "pokeDefaultPicture" src = "${picturesURL[2]}" />
            <img class = "pokeDefaultPicture" src = "${picturesURL[3]}" />
        </div>
        <div class = 'pokeOptions'>
            <button class="button" onclick = 'getPreviousPokemon(event)'>
                <i class="medium material-icons">chevron_left</i>
            </button>
            <button class="button" onclick = 'getNextPokemon(event)'>
                <i class="medium material-icons">chevron_right</i>
            </button>
        </div>
    `;

    pokedexInfo.innerHTML = pokeInnerHTML;
}

function getPreviousPokemon(event){
    let iterator = --index;
    if(iterator <= 0){
        iterator = pokemonNumbers;
    }
    getPokemonData(iterator);
}

function getNextPokemon(event){
    let iterator = ++index;
    if(iterator > pokemonNumbers){
        iterator = 1;
    }
    getPokemonData(iterator);
}

$('.right-section').on('click',function(){
    let pokedex = $('#open-pokedex');

    if(!pokedex[0].classList.contains('hide')){
        pokedex[0].classList.add('hide');
    }
});

$('#showSearchBar').on('click', function(ev) {
    buscaPokemon();
});

function handle(ev){
    if(ev.keyCode === 13){
        buscaPokemon();
    };
}

function buscaPokemon(){
    let text = $('#search-input').val();
    if (text.length > 0){
        text = text.toLowerCase();
        getPokemonData(text);
    }
    $('#search-input').val('');
}