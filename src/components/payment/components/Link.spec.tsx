import { createRenderer } from 'react-test-renderer/shallow'
import { Link } from './Link'
import { Linking } from 'react-native'
import { fireEvent, render } from '@testing-library/react-native'

describe('Link', () => {
  const renderer = createRenderer()
  const openURLSpy = jest.spyOn(Linking, 'openURL')
  const text = 'text'
  const url = 'http://peachbitcoin.com'

  it('should render correctly', () => {
    renderer.render(<Link text={text} url={url} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should open link', () => {
    const { getByText } = render(<Link text={text} url={url} />)
    fireEvent(getByText(text), 'onPress')
    expect(openURLSpy).toHaveBeenCalledWith(url)
  })
})
