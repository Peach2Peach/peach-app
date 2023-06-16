import { PeachScrollView } from './PeachScrollView'
import { render } from '@testing-library/react-native'
import { Text, View } from 'react-native'

describe('PeachScrollView', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<PeachScrollView />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should set responder on start', () => {
    const { UNSAFE_getAllByType } = render(
      <PeachScrollView>
        <Text>Test</Text>
      </PeachScrollView>,
    )
    expect(UNSAFE_getAllByType(View)[1].props.onStartShouldSetResponder()).toBe(true)
  })
  it('should set ref', () => {
    const ref = jest.fn()
    render(<PeachScrollView ref={ref} />)
    expect(ref).toHaveBeenCalled()
  })
})
