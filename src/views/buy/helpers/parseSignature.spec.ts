import { parseSignature } from './parseSignature'

describe('parseSignature', () => {
  const simpleSignature = 'IFi/kJ4sICe+eSuFwYYChcy8HTNa1wKtYcrNpGxkXSjVdIMR9Yt5K9vQnR1BEFJqSePgJe+F9ByfgPScV7ziQOQ='
  const bitcoinSignedMessage = `-----BEGIN BITCOIN SIGNED MESSAGE-----
I confirm that only I, peach03a73739, control the address bcrt1qfdxqm83nf84qx69xlrnuucxha8mwjxm278cak5
-----BEGIN BITCOIN SIGNATURE-----
Version: Bitcoin-qt (1.0)
Address: bcrt1qfdxqm83nf84qx69xlrnuucxha8mwjxm278cak5

${simpleSignature}
-----END BITCOIN SIGNATURE-----`
  it('should return simple signature', () => {
    expect(parseSignature(simpleSignature)).toBe(simpleSignature)
  })
  it('should parse bitcoin signed message to simple signature', () => {
    expect(parseSignature(bitcoinSignedMessage)).toBe(simpleSignature)
  })
  it('should return same string if nothing could be parsed', () => {
    expect(parseSignature('garbage')).toBe('garbage')
  })
})
