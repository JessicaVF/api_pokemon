"use strict";

//--> first we get the data about the first generation (151 pokemons and other info)
// Src= The XHR part is based in: https://attacomsian.com/blog/http-requests-xhr

// create an XHR object
const xhr = new XMLHttpRequest();

// listen for `onload` event
xhr.onload = () => {
  // process response
  if (xhr.status == 200) {
    // parse JSON data
    let pokeJson = JSON.parse(xhr.response);
    pokeProcess(pokeJson);
  } else {
    console.error("Error 1");
  }
};

// create a `GET` request
xhr.open("GET", "https://pokeapi.co/api/v2/generation/1/");

// send request
xhr.send();

// --> Once we have the info about the generation we focus in get just the pokemons (putting aside locations, for example)
function pokeProcess(pokeJson) {
  let pokeList = pokeJson.pokemon_species;

  for (let i = 0; i < 7; i++) {
    let poke = pokeList[i];

    let pokeSection = $("<section>");

    let id = getPokeId(poke.url);
    pokeSection.attr("data-id", id);
    pokeSection.attr("data-url", poke.url);

    let pokeTitle = $("<h2>");
    pokeTitle.text(poke.name);
    pokeSection.append(pokeTitle);

    $("main").append(pokeSection);

    getChain(poke.url, poke.name, id);
  }
}
function getPokeId(pokeUrl) {
  let id = pokeUrl.substring(pokeUrl.indexOf("species") + 8);
  id = id.slice(0, id.length - 1);
  return id;
}

function getChain(pokeUrl, pokeName, id) {
  fetch(pokeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      poke_Evolution(data.evolution_chain.url, pokeName, id);
    })
    .catch(function (error) {
      console.log("error 2");
    });
}

function poke_Evolution(evolution_chain, pokeName, id) {
  fetch(evolution_chain)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      let pokeSmall = data.chain.species.name;
      let pokeMedium = data.chain.evolves_to[0].species.name;
      //   let pokeLarge = data.chain.evolves_to[0].evolves_to[0].species.name;

      //   console.log("hello: " + data.chain.species.name);
      //   console.log("Good day: " + data.chain.evolves_to[0].species.name);
      //   console.log(
      //     "Greetings: " + data.chain.evolves_to[0].evolves_to[0].species.name
      //   );
      if (pokeName == pokeSmall) {
        let pokeSection = $(`[data-id='${id}']`);
        let text = `${pokeName} is the baby of the house, it evolves into ${pokeMedium}`;
        pokeSection.append(text);
      } else if (pokeName == pokeMedium) {
        let pokeSection = $(`[data-id='${id}']`);
        let text = `${pokeName} is the middle kid of the house, is the evolution of ${pokeSmall} and it evolves into ${pokeLarge}`;
        pokeSection.append(text);
      } else if (pokeName == pokeLarge) {
        let pokeSection = $(`[data-id='${id}']`);
        let text = `${pokeName} is the older kid of the house, is the evolution of ${pokeMedium}`;
        pokeSection.append(text);
      }
    })
    .catch(function (error) {
      console.log("error 3 " + pokeName);
    });
}
