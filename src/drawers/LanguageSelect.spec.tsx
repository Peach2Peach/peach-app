import { createRenderer } from 'react-test-renderer/shallow'
import { LanguageSelect } from './LanguageSelect'
import { fireEvent, render } from '@testing-library/react-native'

describe('LanguageSelect', () => {
  const renderer = createRenderer()
  const locales = ['en', 'es']
  const selected = 'en'
  const onSelect = jest.fn()

  it('renders correctly', () => {
    renderer.render(<LanguageSelect {...{ locales, selected, onSelect }} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('selects language', () => {
    const { getByText } = render(<LanguageSelect {...{ locales, selected, onSelect }} />)
    fireEvent(getByText('español'), 'onPress')
    expect(onSelect).toHaveBeenCalledWith('es')
  })
})
