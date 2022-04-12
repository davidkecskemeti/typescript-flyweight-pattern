import fetch from "node-fetch";

interface Pokemon {
  species: {
    name: string;
    url: string;
  };
}

interface PokemonList {
  count: number;
  next: string;
  previous?: any;
  results: {
    name: string;
    url: string;
  }[];
}

function makeURLFlyweights<ReturnType>(urls: Record<string, string>) {
  const myObject: Record<string, Promise<ReturnType>> = {};

  return new Proxy(myObject, {
    get: (target, name: string) => {
      console.log(`Fetching ${name} ${urls[name]}`);
      if (!target[name]) {
        target[name] = fetch(urls[name]).then((res) => res.json());
      }
      return target[name];
    },
  });
}

const URL = "https://pokeapi.co/api/v2/pokemon/";

(async () => {
  const pokemonList = (await (await fetch(URL)).json()) as PokemonList;

  console.log(pokemonList);

  const urls = pokemonList.results.reduce(
    (acc, { name, url }) => ({
      ...acc,
      [name]: url,
    }),
    {}
  );

  console.log(urls);

  const lookup = makeURLFlyweights<Pokemon>(urls);
  const data = await lookup.bulbasaur;

  console.log(data.species);
})();
