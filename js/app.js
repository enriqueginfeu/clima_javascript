const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
})


function buscarClima(e) {
    e.preventDefault();

    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === '') {
        mostrarError ('Se requieren ambos campos');

        return;
    }

    consutarApi(ciudad, pais);

}

function mostrarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        const alerta = document.createElement('div');
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
    alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block">${mensaje}</span>
    `;
    container.appendChild(alerta);

    setTimeout(() => {
        alerta.remove()
        },5000);
    }
}

function consutarApi(ciudad, pais) {

    const appId = '9079c3b4b21b95060f52dc43abe4f174';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;
    
    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( datos => {

            limpiarHTML();

            if(datos.cod === "404") {
                mostrarError('Ciudad Invalida')
                return;
            }

            mostrarClima(datos);

        })
}

function mostrarClima(datos) {
    const { main: { temp, temp_max, temp_min, humidity }, weather: { description }  } = datos;

    const centigrados = kelvinACentigrados(temp);
    const max = kelvinACentigrados(temp_max);
    const min = kelvinACentigrados(temp_min);
    const hum = humidity;
    const cielo = description;
    
    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const humedad = document.createElement('p');
    humedad.innerHTML = `Humedad ${hum} %`;
    humedad.classList.add('text-xl');

    const desc = document.createElement('p');
    desc.innerHTML = datos.weather[0].description;
    desc.classList.add('text-xl');

    const nombre = document.createElement('p');
    nombre.innerHTML = datos.name;
    nombre.classList.add('text-4xl');


    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombre);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultadoDiv.appendChild(humedad);
    resultadoDiv.appendChild(desc);

    resultado.appendChild(resultadoDiv);

}

const kelvinACentigrados = grados => parseInt(grados - 273.15);


function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}