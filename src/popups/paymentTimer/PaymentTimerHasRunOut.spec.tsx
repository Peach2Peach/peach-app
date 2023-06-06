import { PaymentTimerHasRunOut } from './PaymentTimerHasRunOut'
import { render } from '@testing-library/react-native'

describe('PaymentTimerHasRunOut', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<PaymentTimerHasRunOut contract={{ id: '123-456' }} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
