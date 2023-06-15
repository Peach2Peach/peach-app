import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useSellSetup } from './useSellSetup'

describe('useSellSetup', () => {
  const initialProps = { help: 'sellingBitcoin', hideGoBackButton: false } as const

  it('should set up header correctly', () => {
    renderHook(useSellSetup, { wrapper: NavigationWrapper, initialProps })
    expect(headerState.header()).toMatchSnapshot()
  })
})
