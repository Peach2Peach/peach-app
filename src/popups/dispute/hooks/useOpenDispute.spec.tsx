import { renderHook } from 'test-utils'
import { contract } from '../../../../tests/unit/data/contractData'
import { navigateMock } from '../../../../tests/unit/helpers/NavigationWrapper'
import { defaultPopupState, usePopupStore } from '../../../store/usePopupStore'
import { OpenDispute } from '../components/OpenDispute'
import { useOpenDispute } from './useOpenDispute'

describe('useOpenDispute', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('should show open dispute popup', () => {
    const { result } = renderHook(useOpenDispute, { initialProps: contract.id })
    result.current()
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      level: 'WARN',
      content: <OpenDispute />,
      visible: true,
      action2: {
        label: 'open dispute',
        icon: 'alertOctagon',
        callback: expect.any(Function),
      },
      action1: {
        label: 'close',
        icon: 'xSquare',
        callback: expect.any(Function),
      },
    })
  })
  it('should close popup', () => {
    const { result } = renderHook(useOpenDispute, { initialProps: contract.id })
    result.current()
    usePopupStore.getState().action1?.callback()
    expect(usePopupStore.getState().visible).toEqual(false)
  })
  it('should navigate to disputeReasonSelector', () => {
    const { result } = renderHook(useOpenDispute, { initialProps: contract.id })
    result.current()
    usePopupStore.getState().action2?.callback()
    expect(navigateMock).toHaveBeenCalledWith('disputeReasonSelector', { contractId: contract.id })
    expect(usePopupStore.getState().visible).toEqual(false)
  })
})
