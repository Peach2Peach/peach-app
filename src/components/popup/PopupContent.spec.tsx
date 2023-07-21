import { PopupContent } from './PopupContent'
import { fireEvent, render } from '@testing-library/react-native'
import { Text } from '../text'
import { Keyboard } from 'react-native'

describe('PopupContent', () => {
  it('renders correctly', () => {
    const { toJSON } = render(
      <PopupContent>
        <Text>content</Text>
      </PopupContent>,
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('dismisses keyboard on press', () => {
    const dismissSpy = jest.spyOn(Keyboard, 'dismiss')
    const { getByText } = render(
      <PopupContent>
        <Text>content</Text>
      </PopupContent>,
    )
    const pressable = getByText('content')
    fireEvent.press(pressable)
    expect(dismissSpy).toHaveBeenCalled()
  })
})
