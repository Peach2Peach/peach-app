import { PopupContent } from './PopupContent'
import { fireEvent, render } from '@testing-library/react-native'
import { Text } from '../text'
import { Keyboard } from 'react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
expect.extend({ toMatchDiffSnapshot })

describe('PopupContent', () => {
  const defaultContent = (
    <PopupContent>
      <Text>content</Text>
    </PopupContent>
  )
  it('renders correctly', () => {
    const { toJSON } = render(defaultContent)
    expect(toJSON()).toMatchSnapshot()
  })

  it('dismisses keyboard on press', () => {
    const dismissSpy = jest.spyOn(Keyboard, 'dismiss')
    const { getByText } = render(defaultContent)
    const pressable = getByText('content')
    fireEvent.press(pressable)
    expect(dismissSpy).toHaveBeenCalled()
  })

  it('renders correctly when applying style', () => {
    const { toJSON } = render(
      <PopupContent style={{ backgroundColor: 'red' }}>
        <Text>content</Text>
      </PopupContent>,
    )
    expect(render(defaultContent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
