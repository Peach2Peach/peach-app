import { RemotePaymentMethods } from './RemotePaymentMethods'
import { createRenderer } from 'react-test-renderer/shallow'
import { account, updateAccount } from '../../utils/account'

describe('RemotePaymentMethods', () => {
  it('should render correctly without methods', () => {
    const renderer = createRenderer()
    renderer.render(
      <RemotePaymentMethods
        isEditing={false}
        editItem={jest.fn()}
        select={jest.fn()}
        isSelected={jest.fn(() => false)}
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly with methods', () => {
    updateAccount({
      ...account,
      paymentData: [
        {
          type: 'sepa',
          label: 'SEPA',
          id: 'sepa-1234',
          currencies: ['EUR'],
        },
      ],
    })
    const renderer = createRenderer()
    renderer.render(
      <RemotePaymentMethods
        isEditing={false}
        editItem={jest.fn()}
        select={jest.fn()}
        isSelected={jest.fn(() => false)}
      />,
    )
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
