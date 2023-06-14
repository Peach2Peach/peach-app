import { PeachScrollView } from './PeachScrollView'
import { render } from '@testing-library/react-native'
import { ScrollView, Text } from 'react-native'

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
    const { UNSAFE_getByType } = render(
      <PeachScrollView>
        <Text>Test</Text>
      </PeachScrollView>,
    )
    expect(UNSAFE_getByType(ScrollView).props.onStartShouldSetResponder()).toBe(true)
  })
  it('should set ref', () => {
    const ref = jest.fn()
    render(<PeachScrollView scrollRef={ref} />)
    expect(ref).toHaveBeenCalled()
  })
})
