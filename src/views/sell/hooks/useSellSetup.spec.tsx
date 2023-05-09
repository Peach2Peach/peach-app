import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { SellTitleComponent } from '../components/SellTitleComponent'
import { UseSellSetupProps, useSellSetup } from './useSellSetup'

describe('useSellSetup', () => {
  const initialProps: UseSellSetupProps = { help: 'buyingAndSelling', hideGoBackButton: false }
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should set up header correctly', () => {
    renderHook(useSellSetup, { wrapper: NavigationWrapper, initialProps })

    expect(useHeaderState.getState().titleComponent?.type).toEqual(SellTitleComponent)
    expect(useHeaderState.getState().icons?.[0].id).toBe('helpCircle')
  })
})
