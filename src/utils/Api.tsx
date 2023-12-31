import AxiosWrapper from "./AxiosWrapper";
import { RandomInteger }  from "./Utils"
import axios from "axios";

/**
 * A list of all Pokemon forms and the url to their data
 */
var allPokemonForms : {
  name: string
  url: string
}[] = []

var customFormats : {
  [format : string] : {
    name: string
    url: string
  }[]
}
 
/**
 * Basic structure of data that an individual Pokemon posessess.
 * Structure is based on the format in which {@link https://pokeapi.co PokeApi} serves the data.
 */
export type PokemonType = {
  id: number
  name: string
  national_id: number
  types: {
      type: {
          name: string
      }
  }[]
  stats: {
      base_stat: number
      stat: {
          name: string
      }
  }[]
  display_stat: number
}

async function InitializeData(){

  // Create wrapper from which to send API call
  var PokeApiWrapper = new AxiosWrapper('https://pokeapi.co/api/v2/');

  // Fetch a list of all existing forms
  allPokemonForms = (await PokeApiWrapper.get(`pokemon?limit=100000&offset=0`)).data.results

}

/**
 * Function that fetches a random Pokemon form from {@link https://pokeapi.co PokeApi}.
 * Includes some checks to ensure that no placeholder/unobtainable Pokemon are selected.
 * @returns {Promise} Promise containing the received Pokemon.
 */
export async function getRandomPokemon(formatName? : string) : Promise<PokemonType> {

  // Create wrapper from which to send API call
  var wrapper = new AxiosWrapper('https://pokeapi.co/api/v2/');

  // Initialize data if not available yet
  if (allPokemonForms.length === 0) await InitializeData()

  var format = formatName ? customFormats[formatName] : allPokemonForms

  // Fetch a random form
  var form = await wrapper.get(format[RandomInteger(0, format.length)].url)

  // Retry if selected form cannot be used in battle (e.g. miraidon-drive-mode)
  while (form.data.order < 0 || !form.data.sprites.back_shiny)
    form = await wrapper.get(format[RandomInteger(0, format.length)].url)

  // Fetch base species of selected Pokemon to get id within the national dex
  var species = await wrapper.get(form.data.species.url)
  form.data.national_id = species.data.id
  return form.data
}
