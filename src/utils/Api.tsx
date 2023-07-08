import AxiosWrapper from "./AxiosWrapper";
import { RandomInteger }  from "./Utils.js"
 
type ApiResponse = {
    data: object,
  }

export async function getRandomPokemon() {
  var wrapper = new AxiosWrapper('https://pokeapi.co/api/v2/');
  var allForms = await wrapper.get(`pokemon?limit=100000&offset=0`)
  var form = await wrapper.get(allForms.data.results[RandomInteger(0, allForms.data.results.length)].url)

  // Retry if selected form cannot be used in battle (e.g. miraidon-drive-mode)
  while (form.data.order < 0 || !form.data.sprites.back_shiny)
    form = await wrapper.get(allForms.data.results[RandomInteger(0, allForms.data.results.length)].url)

  var species = await wrapper.get(form.data.species.url)
  form.data.national_id = species.data.id
  console.log(form.data)
  return form.data
}


//CURRENTLY UNUSED, SUBJECT TO DELETION
export function getPokemonSprite(id : string, callback : (result : object) => void) {
    var wrapper = new AxiosWrapper('https://pokeapi.co/api/v2/');
    wrapper.get(`pokemon/${id}`).then((response : ApiResponse) => callback(response.data))
}