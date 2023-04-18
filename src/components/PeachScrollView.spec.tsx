import { PeachScrollView } from './PeachScrollView'
import { render } from '@testing-library/react-native'
import { Text } from 'react-native'

describe('PeachScrollView', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<PeachScrollView />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('renders correctly when disabled', () => {
    const { toJSON } = render(<PeachScrollView disable />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set responder on start', () => {
    const { getByText } = render(
      <PeachScrollView>
        <Text>Test</Text>
      </PeachScrollView>,
    )
    expect(getByText('Test').parent?.parent?.props.onStartShouldSetResponder()).toBe(true)
  })
  it('should set ref', () => {
    const ref = jest.fn()
    render(<PeachScrollView scrollRef={ref} />)
    expect(ref).toHaveBeenCalled()
  })
})
