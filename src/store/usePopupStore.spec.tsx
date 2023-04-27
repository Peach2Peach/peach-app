import { Text } from 'react-native'
import { defaultPopupState, usePopupStore } from './usePopupStore'

describe('usePopupStore', () => {
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })

  it('should set visible to true', () => {
    usePopupStore.getState().showPopup()
    expect(usePopupStore.getState().visible).toBe(true)
  })
  it('should set visible to false', () => {
    usePopupStore.getState().closePopup()
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should update the content of a popup when passed to setPopup', () => {
    const Content = () => <Text>Test</Text>
    usePopupStore.getState().setPopup({ content: <Content /> })
    expect(usePopupStore.getState().content).toStrictEqual(<Content />)
  })
  it('should overwrite existing content when no content is passed to setPopup', () => {
    const Content = () => <Text>Test</Text>
    usePopupStore.getState().setPopup({ content: <Content /> })
    usePopupStore.getState().setPopup()
    expect(usePopupStore.getState().content).toStrictEqual(undefined)
  })
  it('should update the title of a popup when passed to setPopup', () => {
    usePopupStore.getState().setPopup({ title: 'Test' })
    expect(usePopupStore.getState().title).toBe('Test')
  })
  it('should overwrite existing title when no title is passed to setPopup', () => {
    usePopupStore.getState().setPopup({ title: 'Test' })
    usePopupStore.getState().setPopup()
    expect(usePopupStore.getState().title).toBe('')
  })
  it('should update the action1 of a popup when passed to setPopup', () => {
    const action = { label: 'Test', callback: () => {} }
    usePopupStore.getState().setPopup({ action1: action })
    expect(usePopupStore.getState().action1).toStrictEqual(action)
  })
  it('should overwrite existing action1 when no action1 is passed to setPopup', () => {
    const action = { label: 'Test', callback: () => {} }
    usePopupStore.getState().setPopup({ action1: action })
    usePopupStore.getState().setPopup()
    expect(usePopupStore.getState().action1).toStrictEqual(undefined)
  })
  it('should update the action2 of a popup when passed to setPopup', () => {
    const action = { label: 'Test', callback: () => {} }
    usePopupStore.getState().setPopup({ action2: action })
    expect(usePopupStore.getState().action2).toStrictEqual(action)
  })
  it('should overwrite existing action2 when no action2 is passed to setPopup', () => {
    const action = { label: 'Test', callback: () => {} }
    usePopupStore.getState().setPopup({ action2: action })
    usePopupStore.getState().setPopup()
    expect(usePopupStore.getState().action2).toStrictEqual(undefined)
  })
  it('should update the level of a popup when passed to setPopup', () => {
    usePopupStore.getState().setPopup({ level: 'SUCCESS' })
    expect(usePopupStore.getState().level).toBe('SUCCESS')
  })
  it('should overwrite existing level when no level is passed to setPopup', () => {
    usePopupStore.getState().setPopup({ level: 'SUCCESS' })
    usePopupStore.getState().setPopup()
    expect(usePopupStore.getState().level).toBe('DEFAULT')
  })
  it('should update the popup state with the params passed to updatePopup', () => {
    usePopupStore.getState().updatePopup({ visible: true })
    expect(usePopupStore.getState().visible).toBe(true)
  })
  it('should not overwrite existing popup state when no params are passed to updatePopup', () => {
    usePopupStore.getState().updatePopup({ visible: true })
    usePopupStore.getState().updatePopup()
    expect(usePopupStore.getState().visible).toBe(true)
  })
  it('should update the requireUserAction of a popup when passed to setPopup', () => {
    usePopupStore.getState().setPopup({ requireUserAction: true })
    expect(usePopupStore.getState().requireUserAction).toBe(true)
  })
  it('should overwrite existing requireUserAction when no requireUserAction is passed to setPopup', () => {
    usePopupStore.getState().setPopup({ requireUserAction: true })
    usePopupStore.getState().setPopup()
    expect(usePopupStore.getState().requireUserAction).toBe(false)
  })
  it('should set visible to false if specified in the params passed to setPopup', () => {
    usePopupStore.getState().setPopup({ visible: false })
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should set visible to true if nothing is specified in the params passed to setPopup', () => {
    usePopupStore.getState().setPopup({ visible: false })
    usePopupStore.getState().setPopup()
    expect(usePopupStore.getState().visible).toBe(true)
  })
  it('should not overwrite existing state even if some other params are passed', () => {
    usePopupStore.getState().setPopup({ visible: false, title: 'Test' })
    usePopupStore.getState().updatePopup({ visible: true })
    expect(usePopupStore.getState().title).toBe('Test')
  })
})

describe('usePopupStore - default state', () => {
  afterEach(() => {
    usePopupStore.setState(defaultPopupState)
  })
  it('should not be visible by default', () => {
    expect(usePopupStore.getState().visible).toBe(false)
  })
  it('should have a content property that is undefined by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'content')).toBe(true)
    expect(usePopupStore.getState().content).toBeUndefined()
  })
  it('should have a title property that is an empty string by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'title')).toBe(true)
    expect(usePopupStore.getState().title).toBe('')
  })
  it('should have an action1 property that is undefined by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'action1')).toBe(true)
    expect(usePopupStore.getState().action1).toBeUndefined()
  })
  it('should have an action2 property that is undefined by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'action2')).toBe(true)
    expect(usePopupStore.getState().action2).toBeUndefined()
  })
  it('should have a level property that is "DEFAULT" by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'level')).toBe(true)
    expect(usePopupStore.getState().level).toBe('DEFAULT')
  })
  it('should have a requireUserAction property that is false by default', () => {
    expect(Object.hasOwn(usePopupStore.getState(), 'requireUserAction')).toBe(true)
    expect(usePopupStore.getState().requireUserAction).toBe(false)
  })
})
