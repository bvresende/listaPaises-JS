let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numOfPopulation = 0;
let numOfPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
    tabCountries = document.querySelector('#tabCountries');
    tabFavorites = document.querySelector('#tabFavorites');

    countCountries = document.querySelector('#countCountries');
    countFavorites = document.querySelector('#countFavorites');

    totalPopulationList = document.querySelector('#totalPopulationList');
    totalPopulationFavorites = document.querySelector('#totalPopulationFavorites');

    numberFormat = Intl.NumberFormat('pt-BR');

    fetchCountries();
    
})

async function fetchCountries() {
    //código sem usar async/await
    //fetch('http://restcountries.eu/rest/v2/all').then( res => res.json() ).then( json => { allCountries = json; console.log(allCountries) });
    // function (json) { return allCountries = json; } //se for só um comando, não precisa de chaves

    const res = await fetch('http://restcountries.eu/rest/v2/all');
    const json = await res.json();
    /*allCountries = json;
    console.log(allCountries);*/
    allCountries = json.map( country => { //"filtra" as informações que interessam //a cada country, retorna um objeto com os atributos definidos
        
        const { numericCode, translations, population, flag } = country;
        //já pode passar a variável que receberá o valor se ele for direto (não precisar entrar dentro de um objeto)
        //quando é repetido, ex: flag: country.flag, pode-se omitir o 'flag'

        return {
            id: numericCode,
            name: translations.pt,
            population,
            flag
        };
    
        /*return {
            id: country.numericCode,
            name: country.translations.pt,
            population: country.population,
            flag: country.flag
        }*/ //há uma repetição de "country.", é possível melhorar isso usando 'destructuring'
    } )

    //console.log(allCountries);

    render();
}

function render() {
    renderCountryList();
    renderFavorites();
    renderSummary();
    hangleCountriesButtons();
}

function renderCountryList () {
    let countriesHTML = '<div>';

    allCountries.forEach( country => {
        const { name, flag, id, population } = country;

        const countryHTML = `
            <div class='country'>
                <div>
                    <a id="${id}" class="waves-effect waves-light btn">+</a>
                </div>
                <div>
                    <img src="${flag}" alt="${name}">
                </div>
                <div>
                    <ul>
                        <li>${name}</li>
                        <li>${population}</li>
                    </ul>
                </div>
            </div>
        `;

        //numOfPopulation += population;

        countriesHTML += countryHTML+'</div>'; //concatena

        tabCountries.innerHTML = countriesHTML;

    } );

    //countCountries.innerHTML = allCountries.length;
    //totalPopulationList.innerHTML = numOfPopulation;

}

function renderFavorites () {
    let favoritesHTML = '<div>'; 

    favoriteCountries.forEach( country => {
        const { name, flag, id, population } = country;

        const favoriteHTML = `
            <div class='country'>
                <div>
                    <a id="${id}" class="waves-effect waves-light btn red">-</a>
                </div>
                <div>
                    <img src="${flag}" alt="${name}">
                </div>
                <div>
                    <ul>
                        <li>${name}</li>
                        <li>${population}</li>
                    </ul>
                </div>
            </div>
        `;

        //numOfPopulationFavorites += population;

        favoritesHTML += favoriteHTML+'</div>'; //concatena

        tabFavorites.innerHTML = favoritesHTML;

    } );

    //countFavorites.innerHTML = favoriteCountries.length;
    //totalPopulationFavorites.innerHTML = numOfPopulationFavorites;
}

function renderSummary () {
    countCountries.innerHTML = allCountries.length;
    countFavorites.innerHTML = favoriteCountries.length;

    numOfPopulation = allCountries.reduce( (accumulator, current) => {
        return accumulator + current.population;
    }, 0)

    totalPopulationList.innerHTML = formatNumber (numOfPopulation);

    numOfPopulationFavorites = favoriteCountries.reduce( (accumulator, current) => {
        return accumulator + current.population;
    }, 0)

    totalPopulationFavorites.innerHTML = formatNumber (numOfPopulationFavorites);

}

function hangleCountriesButtons () {
    const countryButtons = Array.from( tabCountries.querySelectorAll('.btn') ); //retorna uma node list e precisa ser convertido
    //console.log(countryButtons);

    const favoriteButtons = Array.from( tabFavorites.querySelectorAll('.btn') ); //retorna uma node list e precisa ser convertido
    //console.log(countryButtons);

    countryButtons.forEach( button => {
        button.addEventListener('click', () => addToFavorites(button.id));
    } );

    favoriteButtons.forEach( button => {
        button.addEventListener('click', () => removeFromFavorites(button.id));
    } );

}

function addToFavorites(id) {
    const countryToAdd = allCountries.find( country => country.id === id );
    //console.log(countryToAdd);

    favoriteCountries = [...favoriteCountries, countryToAdd];
    //console.log(favoriteCountries);
    favoriteCountries.sort( (a,b) => {
        return a.name.localeCompare(b.name);
    } );

    allCountries = allCountries.filter( country => country.id !== id );

    render();

}

function removeFromFavorites(id) {
    const countryToRemove = favoriteCountries.find( country => country.id === id );
    //console.log(countryToAdd);

    allCountries = [...allCountries, countryToRemove];
    //console.log(favoriteCountries);
    allCountries.sort( (a,b) => {
        return a.name.localeCompare(b.name);
    } );

    favoriteCountries = favoriteCountries.filter( country => country.id !== id );

    render();    
}

function formatNumber (number) {
    return numberFormat.format(number);
}