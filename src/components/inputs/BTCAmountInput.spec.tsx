import { render } from '@testing-library/react-native'
import { BTCAmountInput } from './BTCAmountInput'

describe('BTCAmountInput', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<BTCAmountInput amount={0} onChangeText={jest.fn()} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
