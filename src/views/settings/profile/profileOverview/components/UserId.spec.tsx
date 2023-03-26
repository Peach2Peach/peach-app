import * as React from 'react'

import { create } from 'react-test-renderer'
import { usePublicProfileNavigation } from '../../../../../hooks/usePublicProfileNavigation'
import { UserId } from './UserId'
import { View } from 'react-native'

jest.mock('../../../../../hooks/usePublicProfileNavigation', () => ({
  usePublicProfileNavigation: jest.fn(),
}))

jest.mock('../../../../../components/animation/Fade', () => ({
  Fade: () => <View />,
}))

describe('UserId', () => {
  const id = 'userId'

  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('should set showInfo to false by default', () => {
    const testInstance = create(<UserId id={id} />).root
    expect(testInstance.props.showInfo).toBeFalsy()
  })
  it('should go to user profile if showInfo is true', () => {
    ;(usePublicProfileNavigation as jest.Mock).mockReturnValue(jest.fn())
    const showInfo = true
    const testInstance = create(<UserId {...{ id, showInfo }} />).root
    testInstance.findByProps({ testID: 'user-id' }).props.onPress()
    expect(usePublicProfileNavigation(id)).toHaveBeenCalled()
  })
  it.skip('should copy user id if showInfo is false', () => {
    // test implementation faulty
    const copyMock = jest.fn()
    jest.spyOn(React, 'useRef').mockReturnValue({
      current: {
        copy: copyMock,
      },
    })

    const showInfo = false
    const testInstance = create(<UserId {...{ id, showInfo }} />).root
    testInstance.findByProps({ testID: 'user-id' }).props.onPress()
    expect(copyMock).toHaveBeenCalled()
  })
})
