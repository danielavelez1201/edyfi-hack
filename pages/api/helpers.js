const crypto = require('crypto')

export function hashcode(input) {
  console.log(input)
  if (input === null || input === undefined) {
    return ''
  }
  let md5Bytes = crypto.createHash('md5').update(input).digest()
  md5Bytes[6] &= 0x0f /* clear version        */
  md5Bytes[6] |= 0x30 /* set to version 3     */
  md5Bytes[8] &= 0x3f /* clear variant        */
  md5Bytes[8] |= 0x80 /* set to IETF variant  */
  return md5Bytes.toString('hex')
}
