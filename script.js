"use strict"
  //Variables referentes al buscador y el visualizador
const visualizador = document.querySelector("section.principal");
const buscador = document.querySelector("form"); 
const preview = document.querySelector('ul.preview')

 //Funcion de escritura del mensaje

const escribeMensaje = (mensaje) => {
    visualizador.innerHTML = `<p class="mensaje">${mensaje}</p>`;
};

  //Mensaje por defecto en el visualizador

escribeMensaje("Introduzca un número o un nombre Pokémon en el buscador...");
  const search = async (valor) => {
    preview.innerHTML = '';
    try{
      const api = `https://pokeapi.co/api/v2/pokemon/${valor.toLowerCase()}`;
      const busquedaApi = await fetch(api);
        if(busquedaApi.ok){
        const data = await busquedaApi.json();
        visualizador.classList.replace("principal","pokemon");
        //data necesaria de la Api
        const noHayImagen = "No hay imagen disponible";
        const nombrePok = data.name;
        const imagenDel = data.sprites.front_default;
        const imagenTras = data.sprites.back_default;
        const altura = data.height;
        const peso = data.weight;
        const vida = data.stats[0].base_stat;
        const ataque = data.stats[1].base_stat;
        const defensa = data.stats[2].base_stat;
        const velocidad = data.stats[3].base_stat;
        const largo = data.types.length;
        const fotoAltaReso = data.sprites.other["official-artwork"].front_default;
        //nuevo array de los tipos que pueden ser
        const tipos = [];
        
        for(let i = 0 ; i < largo ;i++){
          const tipo = data.types[i].type.name.toUpperCase();
          tipos.push(` ${tipo} `);
        };
        const tiposCorregido = tipos.join(" & ");
        visualizador.classList.add("flip");
        //pintar información en web
        visualizador.innerHTML= 
        `
        <div>
        <p class="titulo">${nombrePok.toUpperCase()}</p>
        </div>
        
        <div class="pokemonMini">
        </div>
        <div class ="info">
        <img class="grande" src="${fotoAltaReso}">
        <p class="tituloStats"></p>
        <p class="estadistica">Altura: ${altura/10} m</p>
        <p class="tituloStats"></p>
        <p class="estadistica">Peso: ${peso/10} kg</p>
        <p class="tituloStats"></p>
        <p class="estadistica">Vida: ${vida}</p>  
        <p class="tituloStats"></p>
        <p class="estadistica">Ataque: ${ataque}</p> 
        <p class="tituloStats"></p>
        <p class="estadistica">Defensa: ${defensa}</p> 
        <p class="tituloStats"></p>
        <p class="estadistica">Velocidad: ${velocidad}</p> 
        <p class="tituloStats"></p>
        <p class="estadistica">Tipo: ${tiposCorregido}</p> 
        <div>
        <p class="noImagen"></p>
        <img class="imagenPokemon" src="${imagenDel}">
        <img class="imagenPokemon" src="${imagenTras}">
        </div>
        </div>
        `;
    
        //Si la imagen que se reclama no esta emite mensaje de informacion no encontrada
        if(!imagenDel || !imagenTras){
          let p = visualizador.querySelector("p.noImagen");
          p.textContent = noHayImagen;
        }
        }
        else{
          escribeMensaje("Su Pokémon no ha sido encontrado en la base de datos")
        }
        }catch(e){
          escribeMensaje("Por favor introduzca un Pokémon o un numero en el buscador.");
      }
  }
  //Funcion de busqueda en el input
  const handleSubmit = async (e) => {
    e.preventDefault();
  const valores = new FormData(buscador);
  const valor = valores.get("pokemon");
  await search(valor);

  }
//Funcion que extrae todos los nombres de los Pokemon y los guarda en un array llamado nombresPokemon
  async function buscaNombres(){
    try{
    const apiNames = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
    const busquedaApiNames = await fetch(apiNames);
    if(busquedaApiNames.ok){
      const infoNames = await busquedaApiNames.json();
    for(let j = 0; j < infoNames.results.length;j++){
      const namesInfo = infoNames.results[j].name.toLowerCase();
      nombresPokemon.push(namesInfo);
    }
  }
  }catch(e){
    escribeMensaje("El array de nombres para la sugerencia no esta activo");
  }};
// Funcion de coincidencia
  const nombresPokemon = [];
  const similitud = async (e) => {
    e.preventDefault()
    try{
  const valores = new FormData(buscador);
  const valor = valores.get("pokemon");
  //Si alguno comienza por el valor escrito se mostrara para la busqueda.
  let coincidencia = nombresPokemon.filter((nombre) => nombre.startsWith(`${valor.toLowerCase()}`));
  //Solo mostrara 5 palabras sujeridas del filter
  const coincidencias = coincidencia.slice(0, 4);
  console.log(coincidencia);
  //Imprime el array de coincidencias como sugerencia en el navegador.
   const sugerencia = coincidencias.map(coincidencia => `<li class="borrar">${coincidencia}</li>`).join('');
   const sugerencia2 = coincidencias.map(coincidencia => `` ).join('');
  //Si el valor vuelve a ser borrado 
  if(`${valor.length}` == 0){
    escribeMensaje(`Introduce otro Pokemon por favor`);
    visualizador.classList.replace("pokemon","principal");
    preview.innerHTML = sugerencia2;
  }else{
    preview.innerHTML = sugerencia;
  }
  if(coincidencia.length === 1){
     search(coincidencia[0]);
  }
  }catch(e){
    console.error("hay un error en la funcion similitud")
  }
 
};


 
 

preview.addEventListener('click', (e)=> {
    const el = e.target;

    if(el.matches('li')) {
      search(el.textContent)
    }
})

//buscador ejecuta la funcion de busqueda
buscador.addEventListener("input",similitud);
buscador.addEventListener("submit", handleSubmit);
buscaNombres();


