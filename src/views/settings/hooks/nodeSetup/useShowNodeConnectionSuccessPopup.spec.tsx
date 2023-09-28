import { renderHook } from '@testing-library/react-native'
import { NodeConnectionSuccessPopup } from '../../../../popups/success/NodeConnectionSuccessPopup'
import { usePopupStore } from '../../../../store/usePopupStore'
import { useShowNodeConnectionSuccessPopup } from './useShowNodeConnectionSuccessPopup'

describe('useShowNodeConnectionSuccessPopup', () => {
  it('should open correct popup', () => {
    const address = 'address'
    const save = jest.fn()
    const { result } = renderHook(useShowNodeConnectionSuccessPopup)
    result.current({ address, save })
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      visible: true,
      popupComponent: <NodeConnectionSuccessPopup {...{ address, save }} />,
    })
  })
})
