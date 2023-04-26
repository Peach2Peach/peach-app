import { Text } from 'react-native'
import { usePopupStore } from './usePopupStore'

describe('usePopupStore', () => {
  it('should be defined', () => {
    expect(usePopupStore).toBeDefined()
  })
  it('should not be visible by default', () => {
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should have a content property that is undefined by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'content')).toBe(true)
    expect(usePopupStore.getState().content).toBeUndefined()
  })
  it('should set visible to true', () => {
    usePopupStore.getState().showPopup()
    expect(usePopupStore.getState().visible).toBe(true)
  })
  it('should set visible to false', () => {
    usePopupStore.getState().closePopup()
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should update the content of a popup when passed to showPopup', () => {
    const Content = () => <Text>Test</Text>
    usePopupStore.getState().showPopup({ content: <Content /> })
    expect(usePopupStore.getState().content).toStrictEqual(<Content />)
  })
  it('should not overwrite existing content when no content is passed to showPopup', () => {
    const Content = () => <Text>Test</Text>
    usePopupStore.getState().showPopup({ content: <Content /> })
    usePopupStore.getState().showPopup()
    expect(usePopupStore.getState().content).toStrictEqual(<Content />)
  })
  it('should have a title property that is undefined by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'title')).toBe(true)
    expect(usePopupStore.getState().title).toBeUndefined()
  })
  it('should update the title of a popup when passed to showPopup', () => {
    usePopupStore.getState().showPopup({ title: 'Test' })
    expect(usePopupStore.getState().title).toBe('Test')
  })
  it('should not overwrite existing title when no title is passed to showPopup', () => {
    usePopupStore.getState().showPopup({ title: 'Test' })
    usePopupStore.getState().showPopup()
    expect(usePopupStore.getState().title).toBe('Test')
  })
  it('should have an action1 property that is undefined by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'action1')).toBe(true)
    expect(usePopupStore.getState().action1).toBeUndefined()
  })
  it('should update the action1 of a popup when passed to showPopup', () => {
    const action = { label: 'Test', callback: () => {} }
    usePopupStore.getState().showPopup({ action1: action })
    expect(usePopupStore.getState().action1).toStrictEqual(action)
  })
  it('should not overwrite existing action1 when no action1 is passed to showPopup', () => {
    const action = { label: 'Test', callback: () => {} }
    usePopupStore.getState().showPopup({ action1: action })
    usePopupStore.getState().showPopup()
    expect(usePopupStore.getState().action1).toStrictEqual(action)
  })
  it('should have an action2 property that is undefined by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'action2')).toBe(true)
    expect(usePopupStore.getState().action2).toBeUndefined()
  })
  it('should update the action2 of a popup when passed to showPopup', () => {
    const action = { label: 'Test', callback: () => {} }
    usePopupStore.getState().showPopup({ action2: action })
    expect(usePopupStore.getState().action2).toStrictEqual(action)
  })
  it('should not overwrite existing action2 when no action2 is passed to showPopup', () => {
    const action = { label: 'Test', callback: () => {} }
    usePopupStore.getState().showPopup({ action2: action })
    usePopupStore.getState().showPopup()
    expect(usePopupStore.getState().action2).toStrictEqual(action)
  })
})
