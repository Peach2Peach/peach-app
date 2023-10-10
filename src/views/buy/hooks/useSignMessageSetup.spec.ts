import { act, renderHook } from '@testing-library/react-native'
import { bitcoinSignedMessage, simpleSignature } from '../../../../tests/unit/data/signingData'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSignMessageSetup } from './useSignMessageSetup'

describe('useSignMessageSetup', () => {
  it('should set simple signature', () => {
    const { result } = renderHook(useSignMessageSetup, { wrapper: NavigationWrapper })
    act(() => result.current.setSignature(simpleSignature))
    expect(result.current.signature).toBe(simpleSignature)
  })
  it('should parse and set bitcoin signed message as simple signature', () => {
    const { result } = renderHook(useSignMessageSetup, { wrapper: NavigationWrapper })
    act(() => result.current.setSignature(bitcoinSignedMessage))
    expect(result.current.signature).toBe(simpleSignature)
  })
})
