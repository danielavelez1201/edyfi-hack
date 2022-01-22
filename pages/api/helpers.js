import sha256 from 'crypto-js/sha256'

export function hashcode(input) {
  console.log(input)
  if (input === null || input === undefined) {
    return ''
  }
  return sha256(input)
}
