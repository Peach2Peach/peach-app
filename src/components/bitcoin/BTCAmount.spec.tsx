import { BTCAmount } from './BTCAmount'
import { render } from '@testing-library/react-native'

describe('BTCAmount', () => {
  const amount = 21000
  it('should render correctly for extra small size', () => {
    const { toJSON } = render(<BTCAmount amount={amount} size="x small" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for small size', () => {
    const { toJSON } = render(<BTCAmount amount={amount} size="small" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for medium size', () => {
    const { toJSON } = render(<BTCAmount amount={amount} size="medium" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for large size', () => {
    const { toJSON } = render(<BTCAmount amount={amount} size="large" />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly for extra large size', () => {
    const { toJSON } = render(<BTCAmount amount={amount} size="extra large" />)
    expect(toJSON()).toMatchSnapshot()
  })
})
