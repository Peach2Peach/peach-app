import React from 'react'
import { createRenderer } from 'react-test-renderer/shallow'
import { PaymentMethodForm } from './PaymentMethodForm'

jest.mock('./hooks/usePaymentMethodFormSetup', () => ({
  usePaymentMethodFormSetup: () => ({
    data: { type: 'sepa', currencies: ['EUR'] },
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
