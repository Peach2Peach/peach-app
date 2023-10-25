import { act, renderHook } from 'test-utils'
import { bitcoinSignedMessage, simpleSignature } from '../../../../tests/unit/data/signingData'
import { useSignMessageSetup } from './useSignMessageSetup'

describe('useSignMessageSetup', () => {
  it('should set simple signature', () => {
    const { result } = renderHook(useSignMessageSetup)
    act(() => result.current.setSignature(simpleSignature))
    expect(result.current.signature).toBe(simpleSignature)
  })
  it('should parse and set bitcoin signed message as simple signature', () => {
    const { result } = renderHook(useSignMessageSetup)
    act(() => result.current.setSignature(bitcoinSignedMessage))
    expect(result.current.signature).toBe(simpleSignature)
  })
})
