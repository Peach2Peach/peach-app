import { createRenderer } from 'react-test-renderer/shallow'
import tw from '../../../styles/tailwind'
import { PaymentReference } from './PaymentReference'

describe('PaymentReference', () => {
  it('should render an empty PaymentReference', () => {
    const renderer = createRenderer()
    renderer.render(<PaymentReference />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render a full PaymentReference with style', () => {
    const renderer = createRenderer()
    renderer.render(<PaymentReference style={tw`mt-[2px]`} reference="reference" copyable />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
