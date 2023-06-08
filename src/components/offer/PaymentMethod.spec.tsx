import { PaymentMethod } from './PaymentMethod'
import { fireEvent, render } from '@testing-library/react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import i18n from '../../utils/i18n'
import { Linking } from 'react-native'

describe('PaymentMethod', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentMethod paymentMethod="sepa" showLink isDispute={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when there is a link', () => {
    renderer.render(<PaymentMethod paymentMethod="revolut" showLink isDispute={false} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when there is a dispute', () => {
    renderer.render(<PaymentMethod paymentMethod="revolut" showLink isDispute />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should open the url when it is present', () => {
    const { getByText } = render(<PaymentMethod paymentMethod="revolut" showLink isDispute={false} />)
    fireEvent.press(getByText(i18n('paymentMethod.revolut')))
    expect(Linking.openURL).toHaveBeenCalledWith('https://revolut.com/app')
  })
  it('should not open the url when showLink is false', () => {
    const { getByText } = render(<PaymentMethod paymentMethod="revolut" showLink={false} isDispute={false} />)
    fireEvent.press(getByText(i18n('paymentMethod.revolut')))
    expect(Linking.openURL).not.toHaveBeenCalled()
  })
})
