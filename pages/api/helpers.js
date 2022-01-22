import md5 from 'crypto-js/sha256'

export function hashcode(input) {
  console.log('hashcode of', input)
  if (input === null || input === undefined) {
    return ''
  }
  console.log('is', md5(input).toString())
  return md5(input).toString()
}
