import { Keyboard } from 'react-native'
import { toMatchDiffSnapshot } from 'snapshot-diff'
import { fireEvent, render } from 'test-utils'
import { PeachText } from '../text/PeachText'
import { PopupContent } from './PopupContent'
expect.extend({ toMatchDiffSnapshot })

describe('PopupContent', () => {
  const defaultContent = (
    <PopupContent>
      <PeachText>content</PeachText>
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
        <PeachText>content</PeachText>
      </PopupContent>,
    )
    expect(render(defaultContent).toJSON()).toMatchDiffSnapshot(toJSON())
  })
})
