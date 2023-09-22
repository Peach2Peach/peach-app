import { bitcoinSignedMessage, simpleSignature } from '../../../../tests/unit/data/signingData'
import { parseSignature } from './parseSignature'

describe('parseSignature', () => {
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
