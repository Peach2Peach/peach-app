import { usePopupStore } from './usePopupStore'

describe('usePopupStore', () => {
  it('should be defined', () => {
    expect(usePopupStore).toBeDefined()
  })
  it('should not be visible by default', () => {
    expect(usePopupStore.getState().visible).toBe(false)
  })
})
