const globalKey = process.env.TMDB_API_KEY;
const mainCinema = document.getElementById('main-cinema');

let guestOnePages;
let guestTwoPages;

let guestOneProvidersID = [];
let guestTwoProvidersID = [];

let guestOneMoviesID = [];
let guestTwoMoviesID = [];

let commonMovies = [];

let base_URL;
let size = 'w342'
let movieImg;

let movieProviders = [];

const initSelectors = async () =>{
  await getConfiguration();   //Get base_URL for picturesURL
  await getCountryProviders();
}

async function fetchMovies(){   
  if(await secureCheck()){
    setAllValuesNull();

    // insertPreloader();

    await getGuestOnePages();    
    await getGuestTwoPages();    
    for(let i = 1; i < guestOnePages + 1; i++){
        await getGuestOneMoviesID(i);
    }
    for(i = 1; i < guestTwoPages + 1; i++){
      await getGuestTwoMoviesID(i);
    }

    commonMovies = guestOneMoviesID.filter(el => guestTwoMoviesID.includes(el));
    // commonMovies = await intersection(guestOneMoviesID,guestTwoMoviesID);

    if(commonMovies.length > 0){
      mainCinema.innerHTML = "";
      for(i = 0; i < commonMovies.length; i++){
        await createMovieCard(commonMovies[i]);
      }
    }else{
      mainCinema.innerHTML = "";
      window.alert("We couldn't find any coincideces, try again with other parameters.")
    }
  }else {
    window.alert('You have to select Country AND Provider/s for each guest.');
  }
  console.log('Finish!!');
}

const getConfiguration = async () =>{
    const url = `https://api.themoviedb.org/3/configuration?api_key=${globalKey}`
    const imgBaseUrl = await fetch(url)
        .then(res => res.json())
        .catch(()=>console.log('Error'));

    base_URL = imgBaseUrl.images.secure_base_url;
}
function secureCheck(){
  if(document.getElementById('countries1').value != "" && document.getElementById('countries2').value != ""){
    if(checkChildsSelected()){
      return true;
    }
  }
  return false;
}
function checkChildsSelected(){
  guestOneProvidersID.length = 0;
  guestTwoProvidersID.length = 0;

  const country1 = document.getElementById('guest1-providers').children;
  const country2 = document.getElementById('guest2-providers').children;

  for(let i = 0; i < country1.length; i++){
    if(country1[i].classList.contains('gridItemActive')){
      guestOneProvidersID.push(country1[i].getAttribute('providerid')*1);
    }
    if(country2[i].classList.contains('gridItemActive')){
      guestTwoProvidersID.push(country2[i].getAttribute('providerid')*1);
    }
  }

  if(guestOneProvidersID.length != 0 && guestTwoProvidersID.length != 0){
    return true;
  }
  return false;
}
function setAllValuesNull(){
  mainCinema.innerHTML = "";
  guestOneMoviesID.length = 0;
  guestTwoMoviesID.length = 0;
  commonMovies.length = 0;
}
function insertPreloader(){
  const preloader = document.createElement('div');
  preloader.classList.add = ('preloader-wrapper','big','active');

  const innerPreloader = `
  <div class="spinner-layer spinner-blue-only">
      <div class="circle-clipper left">
          <div class="circle"></div>
      </div><div class="gap-patch">
          <div class="circle"></div>
      </div><div class="circle-clipper right">
          <div class="circle"></div>
      </div>
  </div>
  `;

  preloader.innerHTML = innerPreloader;

  mainCinema.appendChild(preloader);
}

//This block is for getting movies ID
const getGuestOnePages = async () => {
  const country = document.getElementById('countries1').value;
  const providersOneID = guestOneProvidersID.join(',');
  
  const urlMovie = `https://api.themoviedb.org/3/discover/movie?api_key=${globalKey}&sort_by=popularity.desc&page=1&with_watch_providers=${providersOneID}&watch_region=${country}&with_watch_monetization_types=flatrate`;
  const movies = await fetch(urlMovie)
      .then(res => res.json())
      .catch(() => console.log('Error'));

  guestOnePages = movies.total_pages;
}
const getGuestTwoPages = async () => {
  const country = document.getElementById('countries2').value;
  const providersTwoID = guestTwoProvidersID.join(',');

  const urlMovie = `https://api.themoviedb.org/3/discover/movie?api_key=${globalKey}&sort_by=popularity.desc&page=1&with_watch_providers=${providersTwoID}&watch_region=${country}&with_watch_monetization_types=flatrate`;
  const movies = await fetch(urlMovie)
    .then(res => res.json())
    .catch(() => console.log('Error'));

  guestTwoPages = movies.total_pages;
}
const getGuestOneMoviesID = async page => {
  const country = document.getElementById('countries1').value;
  const providers = guestOneProvidersID.join(',');

  const urlPages = `https://api.themoviedb.org/3/discover/movie?api_key=${globalKey}&sort_by=popularity.desc&page=${page}&with_watch_providers=${providers}&watch_region=${country}&with_watch_monetization_types=flatrate`;
  const vietnamPage = await fetch(urlPages)
    .then(res => res.json())
    .catch(() => console.log('Error'));

  for(let i = 0; i < vietnamPage.results.length; i++){
      guestOneMoviesID.push(vietnamPage.results[i].id);
  }
}
const getGuestTwoMoviesID = async page => {
  const country = document.getElementById('countries2').value;
  const providers = guestTwoProvidersID.join(',');

  const urlPages = `https://api.themoviedb.org/3/discover/movie?api_key=${globalKey}&sort_by=popularity.desc&page=${page}&with_watch_providers=${providers}&watch_region=${country}&with_watch_monetization_types=flatrate`;
  const spainPage = await fetch(urlPages)
    .then(res => res.json())
    .catch(() => console.log('Error'));

  for(let i = 0; i < spainPage.results.length; i++){
    guestTwoMoviesID.push(spainPage.results[i].id);
  }
}
//End of the block

async function intersection(arr1,arr2){
  let longestArray;
  if(arr1.length > arr2.length){
    longestArray = arr2;
    arr2 = arr1;
    arr1 = longestArray;
    return arr1.filter(function (e){
        return arr2.indexOf(e) > -1;
    });
    // .filter(function(e,i,c){
    //     return c.indexOf(e) === i;
    // });
  }
}


const createMovieCard = async id =>{
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${globalKey}`;
  const movie = await fetch(url)
    .then(res => res.json())
    .catch(()=>console.log('Error'));

  createHTMLCard(movie);
}
function createHTMLCard(movie) {
  const mainCard = document.createElement('div');
  mainCard.classList.add('card');
  mainCard.id = movie.id;

  const mainCardInnerHTML = `
    <div class="card-image waves-effect waves-block waves-light">
      <img class="activator" src="${base_URL}${size}${movie.poster_path}">
    </div>
    <div class="card-content">
      <span class="card-title activator white-text text-darken-4">${movie.original_title}<i class="material-icons right">more_vert</i></span>
      <div class = "movie_Score"><a href="${movie.homepage}">${movie.vote_average}</a></div>
    </div>
    <div class="card-reveal">
      <span class="card-title white-text text-darken-4">${movie.original_title}<i class="material-icons right">close</i></span>
      <p>${movie.overview}</p>
    </div>
  `;

  mainCard.innerHTML = mainCardInnerHTML;

  mainCinema.appendChild(mainCard);
}

const getCountryProviders = async () =>{
  const url = `https://api.themoviedb.org/3/watch/providers/regions?api_key=${globalKey}` //This give me the list of countries
  // const url = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${globalKey}&watch_region=ES&with_watch_monetization_types=flatrate` //Movie Providers
  const movie = await fetch(url)
    .then(res => res.json())
    .catch(()=>console.log('Error'));

  setCountriesOptions(movie.results);
}

function setCountriesOptions(providers){
  for(let i = 0; i < providers.length; i++){
    addOptions(providers[i]);
  }
}
function addOptions(provider){
  let guest1Countries = document.getElementById('countries1');
  let guest2Countries = document.getElementById('countries2');
  
  let options1 = document.createElement('option');
  options1.innerText = provider.english_name;
  // options1.appendChild(document.createTextNode(provider.english_name));
  options1.value = provider.iso_3166_1;

  let options2 = document.createElement('option');
  options2.appendChild(document.createTextNode(provider.english_name));
  options2.value = provider.iso_3166_1;

  guest1Countries.appendChild(options1);
  guest2Countries.appendChild(options2);
}

async function chargeProviders1(country){
  clearGridContainer(1);
  if (country !== ""){
    await providers(country,1);    
  }
}
async function chargeProviders2(country){
  clearGridContainer(2);
  if (country !== ""){
    await providers(country,2);    
  }
}

async function providers(country,num){
  const url = `https://api.themoviedb.org/3/watch/providers/movie?api_key=${globalKey}&watch_region=${country}&with_watch_monetization_types=flatrate`
  const providersByCountry = await fetch(url)
    .then(res => res.json())
    .catch(err => console.log(err));

  const indexMainProviders = findMainProviders(providersByCountry.results);
  const indexProviders = populateProviders(indexMainProviders,providersByCountry.results.length);
  
  clearGridContainer(num);

  for(let i = 0; i < indexProviders.length; i++){
    addGridItem(indexProviders[i],providersByCountry.results,num);
  }
}

function findMainProviders(provider){
  //This functions is to find the index of the main Providers like Netflix, Prime or HBO
  let indexOfMainProviders = [];
  let netflixFound = provider.findIndex(function(el,index){
    if(el.provider_id == 8){
      return true;
    }
  });
  if(netflixFound != -1){
    indexOfMainProviders.push(netflixFound);
  }

  let primeFound = provider.findIndex(function(el,index){
    if(el.provider_id == 119){
      return true;
    }
  });
  if(primeFound != -1){
    indexOfMainProviders.push(primeFound);
  }

  let hboFound = provider.findIndex(function(el,index){
    if(el.provider_id == 118){
      return true;
    }
  });
  if(hboFound != -1){
    indexOfMainProviders.push(hboFound);
  }
  return indexOfMainProviders;
}
function populateProviders(arr,len){
  while(arr.length<6){
    let randomIndex = Math.floor(Math.random() * len)
      if(!arr.includes(randomIndex)){
        arr.push(randomIndex);
      }
    }
  return arr;
}
function clearGridContainer(num){
  let container;
  if(num === 1){
    container =  document.getElementById('guest1-providers');  
  }else if(num === 2){
    container =  document.getElementById('guest2-providers');
  }
  container.innerHTML = ""; 
}
function addGridItem(index,arr,num){
  let container;
  if(num === 1){
    container =  document.getElementById('guest1-providers');  
  }else if(num === 2){
    container =  document.getElementById('guest2-providers');
  }

  const gridItem = document.createElement('div');
  gridItem.classList.add('grid-item');
  gridItem.setAttribute('providerId',arr[index].provider_id);
  const itemInnerHTML = `
    <img src="${base_URL}w92${arr[index].logo_path}" onclick="setGridItemActive(this)">
  `;

  gridItem.innerHTML = itemInnerHTML;

  container.appendChild(gridItem);
}

function handle(ev){
  if(ev.keyCode === 13){
    console.log('Call a function');
  };
}
function setGridItemActive(item){
  if(item.parentNode.classList.contains('gridItemActive')){
    item.parentNode.classList.add('grid-item');
    item.parentNode.classList.remove('gridItemActive');
  } else {
    item.parentNode.classList.remove('grid-item');
    item.parentNode.classList.add('gridItemActive');
  }
}

initSelectors();

$('#searchCommonsbtn').on('click',function(ev) {
    fetchMovies();
});
