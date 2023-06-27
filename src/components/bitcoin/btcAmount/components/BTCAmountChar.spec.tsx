import { BTCAmountChar } from './BTCAmountChar'
import { render } from '@testing-library/react-native'

describe('BTCAmountChar', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <BTCAmountChar char="1" isError={false} reduceOpacity={false} style={[]} letterSpacing={0} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with error', () => {
    const { toJSON } = render(
      <BTCAmountChar char="1" isError={true} reduceOpacity={false} style={[]} letterSpacing={0} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with reduceOpacity', () => {
    const { toJSON } = render(
      <BTCAmountChar char="1" isError={false} reduceOpacity={true} style={[]} letterSpacing={0} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
  it('should render correctly with reduceOpacity and isError', () => {
    const { toJSON } = render(
      <BTCAmountChar char="1" isError={true} reduceOpacity={true} style={[]} letterSpacing={0} />,
    )
    expect(toJSON()).toMatchSnapshot()
  })
})
