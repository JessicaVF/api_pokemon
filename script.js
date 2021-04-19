"use strict";

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
    console.error("Error!");
  }
};

// create a `GET` request
xhr.open("GET", "https://pokeapi.co/api/v2/generation/1/");

// send request
xhr.send();

function pokeProcess(pokeJson) {
  let pokeList = pokeJson.pokemon_species;

  for (let i = 0; i < pokeList.length; i++) {
    let poke = pokeList[i];
    let pokeSection = $("<section>");

    let id = getPokeId(poke.url);
    pokeSection.attr("data-id", id);
    pokeSection.attr("data-url", poke.url);
    $("main").append(pokeSection);
    getChain(poke.url);
  }
}
function getPokeId(pokeUrl) {
  let id = pokeUrl.substring(pokeUrl.indexOf("species") + 8);
  id = id.slice(0, id.length - 1);
  return id;
}

//// working here

function getChain(pokeUrl) {
  fetch(pokeUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      poke_Evolution(data.evolution_chain.url);
    })
    .catch(function (error) {
      console.log("error");
    });
}

function poke_Evolution(evolution_chain) {
  fetch(evolution_chain)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("hello: " + data.chain.species.name);
      console.log("Good day: " + data.chain.evolves_to[0].species.name);
      console.log(
        "Greetings: " + data.chain.evolves_to[0].evolves_to[0].species.name
      );
    })
    .catch(function (error) {
      console.log("error");
    });
}
