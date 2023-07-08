export function RandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

export function CapitaliseFirst(string) {
  return (`${string?.charAt(0).toUpperCase()}${string?.slice(1)}`)
}