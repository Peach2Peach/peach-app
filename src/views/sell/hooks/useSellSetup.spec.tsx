import { renderHook } from '@testing-library/react-native'
import { headerState, NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { UseSellSetupProps, useSellSetup } from './useSellSetup'

describe('useSellSetup', () => {
  const initialProps: UseSellSetupProps = { help: 'sellingBitcoin', hideGoBackButton: false }

  it('should set up header correctly', () => {
    renderHook(useSellSetup, { wrapper: NavigationWrapper, initialProps })
    expect(headerState.header()).toMatchSnapshot()
  })
})
