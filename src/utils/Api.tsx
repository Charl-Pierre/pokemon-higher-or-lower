import AxiosWrapper from "./AxiosWrapper";
import { RandomInteger }  from "./Utils"
 
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

/**
 * Function that fetches a random Pokemon form from {@link https://pokeapi.co PokeApi}.
 * Includes some checks to ensure that no placeholder/unobtainable Pokemon are selected.
 * @returns {Promise} Promise containing the received Pokemon.
 */
export async function getRandomPokemon() : Promise<PokemonType> {

  // Create wrapper from which to send API call
  var wrapper = new AxiosWrapper('https://pokeapi.co/api/v2/');
  
  // Get all existing Pokemon forms
  var allForms = await wrapper.get(`pokemon?limit=100000&offset=0`)

  // Fetch a random form
  var form = await wrapper.get(allForms.data.results[RandomInteger(0, allForms.data.results.length)].url)

  // Retry if selected form cannot be used in battle (e.g. miraidon-drive-mode)
  while (form.data.order < 0 || !form.data.sprites.back_shiny)
    form = await wrapper.get(allForms.data.results[RandomInteger(0, allForms.data.results.length)].url)

  // Fetch base species of selected Pokemon to get id within the national dex
  var species = await wrapper.get(form.data.species.url)
  form.data.national_id = species.data.id
  return form.data
}