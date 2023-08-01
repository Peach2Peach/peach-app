import { setDrawer, useDrawerContext } from './drawer'
import { renderHook } from '@testing-library/react-native'

describe('useDrawerContext', () => {
  it('should return the default state', () => {
    const { result } = renderHook(() => useDrawerContext())
    expect(result.current[0]).toEqual({
      title: '',
      content: null,
      options: [],
      show: false,
      previousDrawer: undefined,
      onClose: expect.any(Function),
    })
    expect(result.current[1]).toEqual(expect.any(Function))
  })
})

describe('setDrawer', () => {
  it('should return the default state', () => {
    expect(setDrawer({}, {})).toEqual({
      title: '',
      content: null,
      options: [],
      show: false,
      previousDrawer: undefined,
      onClose: expect.any(Function),
    })
  })
  it('should do a partial update', () => {
    expect(setDrawer({}, { title: 'foo' })).toEqual({
      title: 'foo',
      content: null,
      options: [],
      show: false,
      previousDrawer: undefined,
      onClose: expect.any(Function),
    })
  })
})
