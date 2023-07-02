import { PaymentMethodForm } from './PaymentMethodForm'
import { createRenderer } from 'react-test-renderer/shallow'
import React from 'react'

jest.mock('./hooks/usePaymentMethodFormSetup', () => ({
  usePaymentMethodFormSetup: () => ({
    paymentMethod: 'sepa',
    data: {},
    onSubmit: jest.fn(),
  }),
}))

describe('PaymentMethodForm', () => {
  const renderer = createRenderer()
  const saveForm = jest.fn()
  jest.spyOn(React, 'useRef').mockReturnValue({ current: { save: saveForm } })
  it('should render correctly', () => {
    renderer.render(<PaymentMethodForm />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
