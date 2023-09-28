import { renderHook } from '@testing-library/react-native'
import { NodeConnectionErrorPopup } from '../../../../popups/warning/NodeConnectionErrorPopup'
import { usePopupStore } from '../../../../store/usePopupStore'
import { useShowNodeConnectionErrorPopup } from './useShowNodeConnectionErrorPopup'

describe('useShowNodeConnectionErrorPopup', () => {
  it('should open correct popup', () => {
    const error = 'error'
    const { result } = renderHook(useShowNodeConnectionErrorPopup)
    result.current(error)
    expect(usePopupStore.getState()).toEqual({
      ...usePopupStore.getState(),
      visible: true,
      popupComponent: <NodeConnectionErrorPopup {...{ error }} />,
    })
  })
})
