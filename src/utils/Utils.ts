/**
 * Function that generates a random value.
 * @param {*} min - Lower bound (inclusive)
 * @param {*} max - Upper bound (exclusive)
 * @returns A random integer between the specified bounds 
 */
export function RandomInteger(min : number, max : number) : number {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

/**
 * Capitalizes the first letter of a word.
 * @param {string} string - String to capitalize
 * @returns The specified string with the first letter capitalized.
 */
export function CapitaliseFirst(string : string) : string {
  return (`${string?.charAt(0).toUpperCase()}${string?.slice(1)}`)
}