

// configuracion

const limite_pokemoncillos = 151; //151



class Pokemon { 

    // 1. Constructor con toda la información para este objeto
    constructor({ name, sprites, types, weight, height, abilities }) {
        this.name = name;
        this.image = sprites.front_default;
        this.types = types.map(typeInfo => typeInfo.type.name); //for 
        this.weight = weight;
        this.height = height;
        this.abilities = abilities.map(abilityInfo => abilityInfo.ability.name); //for 
    }


    // 2.  Funcion crear tarjeta
    createCard() {
        const Tarjeta = document.createElement('div'); //crea elemento nuevo
        Tarjeta.classList.add('pokemon-tarjeta'); // agrega al elemento Tarjeta
        Tarjeta.setAttribute('data-name', this.name.toLowerCase());  // guarda atributo pero en minusculas para su busqueda

        //console.log(Tarjeta)
       
        // ya creo el innerhtml de cada Tarjeta
        Tarjeta.innerHTML = 
            '<img src="' + this.image + '" alt="' + this.name + '" class="pokemon-tarjeta-image">' +
            '<div class="pokemon-tarjeta-info">' +
                '<h3 class="pokemon-tarjeta-name">' + this.name + '</h3>' +
                '<p class="pokemon-tarjeta-type">' + this.types.join(', ') + '</p>' + // los types que tenemos es un arreglo asi que c
            '</div>';


        // importante para mostrar el modal usar este listener
        Tarjeta.addEventListener('click', () => {
            this.Abrir_Modal();  
        });

        //console.log(Tarjeta)
        return Tarjeta;
    }

    // 3 Función del propio objeto para al dar click mostrar tarjeta
    Abrir_Modal() {
        // buscamos el modal y le cambiamos su contenido 
        const modal = document.getElementById('pokemon-modal');
        document.getElementById('modal-pokemon-nombre').textContent = this.name;
        document.getElementById('modal-pokemon-imagen').src = this.image;
        document.getElementById('modal-pokemon-tipos').textContent = 'Tipos: ' + this.types.join(', '); // arreglo de types
        document.getElementById('modal-pokemon-peso').textContent = 'Peso: ' + this.weight + ' kilos';
        document.getElementById('modal-pokemon-altura').textContent = 'Altura: ' + this.height + ' cm';
        document.getElementById('modal-pokemon-habilidades').textContent = 'Habilidades: ' + this.abilities.join(', ');

        modal.style.display = 'block'; //para mostrar el modal
    }
}// end Clase






//iniciamos proyecto en modo EcmaScript 6
const init = () => {
    
    fetch("https://pokeapi.co/api/v2/pokemon?limit="+ limite_pokemoncillos +"&offset=0") //hacemos el http get con el fetch 
        .then(res => res.json()) 
        .then(data => {
            //console.log(data)
            //console.log(data.results)

            // 1. en vez de usar for para el ecma usamos el map entonces
            const urlArray = data.results.map(pokemon => pokemon.url);  // guardamos en array el url de cada pokemon


            // hacemos otra promesa pa ver mas info del pokemon ese
            const arrayPromise = urlArray.map(url =>
                fetch(url)
                    .then(res => {
                        if (!res.ok) { //no jalo tonses enviamos error
                            throw new Error('HTTP error! status: ' + res.status);
                        }

                        return res.json(); //regresamos el json del pokemon si si jalo
                    })
                    .catch(error => {
                        console.error('Error fetching data for URL: ' + url, error);
                        return null;  //no jalo lo de obtener info 
                    })
            );

            return Promise.all(arrayPromise); //Esperamos a que se completen todas las promesas ya sea hayan estado bien o mal
            //return Promise.allSettled(arrayPromise);; //para ir mostrando conforme se terminan 
        })
        .then(arrayRes => {
            // 1. Filtramos cualquier respuesta nula que no funciono o que se pudo haber añadido por error
            arrayRes = arrayRes.filter(pokemon => pokemon !== null);


            // pa saber el numero de pokemoncillos que si cargaron
            console.log("Numero de Pokémon cargados correctamente:" + String(arrayRes.length));

            // 2. buscamos el elemento de pokemon listas para ahi meter sus tarjetas
            const pokemonListElement = document.getElementById('pokemon-listas');


            // 3. con ecma6 hacemos el for para ir creando un nuevo pokemon, luego la tarjeta 
            arrayRes.forEach(pokemonData => { //le manda la data 
                const pokemon = new Pokemon(pokemonData);  // Crear una instancia de Pokemon le manda la data
                const Tarjeta = pokemon.createCard();  // Crear la tarjeta HTML del Pokémon
                pokemonListElement.appendChild(Tarjeta);  // Añadir la tarjeta al contenedor/lista de pokemones en el html se la inyecta
            });

            
            //Listener chido para conforme escribimos en el input se vaya filtrando 
            document.getElementById('busqueda-input').addEventListener('input', Buscar_Pokemon);
        }) 
        .catch(error => console.log('Error fetching datos:', error));//si ya desde el inicio no funciono lo del fetch  de obtener los 151 o sepa cuantos pokemones 
}// end init






// Click pa cerrar el modal 
document.querySelector('.cerrar-modal').addEventListener('click', () => {
    document.getElementById('pokemon-modal').style.display = 'none'; //quitamos
});


//click en cualquier lado que no sea el modal pa cerrar modal
window.addEventListener('click', (event) => {
    const modal = document.getElementById('pokemon-modal');
    if (event.target === modal) {  // si no es el modal
        modal.style.display = 'none'; //quitamos
    }
});



// Función para filtrar o buscar pokemones
const Buscar_Pokemon = () => {
    const buscar_value = document.getElementById('busqueda-input')
    const buscar_minusculas = buscar_value.value.toLowerCase(); 
    const pokemonTarjetas = document.querySelectorAll('.pokemon-tarjeta');

    pokemonTarjetas.forEach(Tarjeta_i => {
        //console.log(pokemonCards)

        const pokemonName = Tarjeta_i.getAttribute('data-name');  // 
        if (pokemonName && pokemonName.toLowerCase().includes(buscar_minusculas)) {
            Tarjeta_i.style.display = 'block';  // La moestra
        } else {
            Tarjeta_i.style.display = 'none';  // La pone invisible
        }
    });
}





// Ya que cargue toda la pagina bien ejecutamos el init
document.addEventListener('DOMContentLoaded', init);
