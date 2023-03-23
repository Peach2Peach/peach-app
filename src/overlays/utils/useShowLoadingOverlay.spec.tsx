import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { useShowLoadingOverlay } from './useShowLoadingOverlay'

describe('useShowLoadingOverlay', () => {
  jest.mock('../../contexts/overlay', () => ({
    useContext: jest.fn().mockReturnValue({
      setOverlay: jest.fn(),
    }),
  }))
  it('should call updateOverlay with the correct arguments when showLoadingOverlay is called', () => {
    const updateOverlay = jest.fn()
    jest.spyOn(React, 'useContext').mockReturnValue([null, updateOverlay])
    const { result } = renderHook(() => useShowLoadingOverlay())
    act(() => {
      result.current('title')
    })
    expect(updateOverlay).toHaveBeenCalledWith({
      title: 'title',
      content: expect.any(Object),
      visible: true,
      level: 'WARN',
      requireUserAction: true,
      action1: {
        label: expect.any(String),
        icon: expect.any(String),
        callback: expect.any(Function),
      },
    })
  })
})
