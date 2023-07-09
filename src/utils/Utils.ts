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

/**
 * Sets a cookie to the specified value
 * @param {string} cname - The name of the cookie
 * @param {string} cvalue - The value to save in the cookie
 */
export function setCookie(cname : string, cvalue : string) : void {
  document.cookie = cname + "=" + cvalue + ";path=/";
}

/**
 * Retrieves the value from a specified cookie
 * @param {string} cname - The name of the cookie 
 * @returns The value associated with the specified cookie
 */
export function getCookie(cname : string) : string {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}