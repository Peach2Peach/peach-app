import { fireEvent, render } from '@testing-library/react-native'
import { Linking } from 'react-native'
import { createRenderer } from 'react-test-renderer/shallow'
import { PaymentMethodBubble } from './PaymentMethodBubble'

describe('PaymentMethodBubble', () => {
  const renderer = createRenderer()
  it('renders correctly', () => {
    renderer.render(<PaymentMethodBubble paymentMethod="sepa" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('renders correctly when there is a link', () => {
    renderer.render(<PaymentMethodBubble paymentMethod="revolut" />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })

  it('should open the url when it is present', () => {
    const { getByText } = render(<PaymentMethodBubble paymentMethod="revolut" />)
    fireEvent.press(getByText('Revolut'))
    expect(Linking.openURL).toHaveBeenCalledWith('https://revolut.com/app')
  })
})
