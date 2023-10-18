import { render } from 'test-utils'
import { BTCAmountChar } from './BTCAmountChar'

describe('BTCAmountChar', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <BTCAmountChar char="1" white={false} reduceOpacity={false} style={[]} letterSpacing={0} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly when white', () => {
    const { toJSON } = render(<BTCAmountChar char="1" white reduceOpacity={false} style={[]} letterSpacing={0} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with reduceOpacity', () => {
    const { toJSON } = render(<BTCAmountChar char="1" white={false} reduceOpacity={true} style={[]} letterSpacing={0} />)
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with reduceOpacity and white', () => {
    const { toJSON } = render(<BTCAmountChar char="1" white={true} reduceOpacity={true} style={[]} letterSpacing={0} />)
    expect(toJSON()).toMatchSnapshot()
  })
})
