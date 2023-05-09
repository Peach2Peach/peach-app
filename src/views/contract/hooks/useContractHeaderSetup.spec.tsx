import { renderHook } from '@testing-library/react-native'
import { NavigationWrapper } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useHeaderState } from '../../../components/header/store'
import { useContractHeaderSetup } from './useContractHeaderSetup'

describe('useContractHeaderSetup', () => {
  it('should set up the header correctly for trade in dispute', () => {
    renderHook(
      () =>
        useContractHeaderSetup({
          contract: { disputeActive: true },
          view: 'buyer',
          requiredAction: 'none',
          contractId: '123',
        }),
      { wrapper: NavigationWrapper },
    )

    expect(useHeaderState.getState().titleComponent).toMatchSnapshot()
    expect(useHeaderState.getState().icons).toEqual([])
    expect(useHeaderState.getState().hideGoBackButton).toEqual(false)
  })
})
