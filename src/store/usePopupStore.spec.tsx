import { Text } from 'react-native'
import { defaultPopupState, usePopupStore } from './usePopupStore'

const MockContent = () => <Text>Test</Text>

describe('usePopupStore', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should set visible to false', () => {
    usePopupStore.getState().closePopup()
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should update the popupComponent when passed to setPopup', () => {
    usePopupStore.getState().setPopup(<MockContent />)
    expect(usePopupStore.getState().popupComponent).toStrictEqual(<MockContent />)
    expect(usePopupStore.getState().visible).toBe(true)
  })
})

describe('usePopupStore - default state', () => {
  beforeEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should not be visible by default', () => {
    expect(usePopupStore.getState().visible).toBe(false)
  })
})
