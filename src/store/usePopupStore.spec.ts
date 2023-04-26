import { usePopupStore } from './usePopupStore'

describe('usePopupStore', () => {
  it('should be defined', () => {
    expect(usePopupStore).toBeDefined()
  })
  it('should not be visible by default', () => {
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should have a content property that is undefined by default', () => {
    expect(Object.getOwnPropertyNames(usePopupStore.getState())).toContain('content')
    expect(usePopupStore.getState().content).toBeUndefined()
  })
})
