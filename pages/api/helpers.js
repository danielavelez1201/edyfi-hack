import md5 from 'crypto-js/sha256'

export function hashcode(input) {
  if (input === null || input === undefined) {
    return ''
  }
  return md5(input).toString()
}
