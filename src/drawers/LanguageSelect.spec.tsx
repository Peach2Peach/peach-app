import { createRenderer } from 'react-test-renderer/shallow'
import { fireEvent, render } from 'test-utils'
import { LanguageSelect } from './LanguageSelect'

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
    fireEvent(getByText('Español'), 'onPress')
    expect(onSelect).toHaveBeenCalledWith('es')
  })
})
