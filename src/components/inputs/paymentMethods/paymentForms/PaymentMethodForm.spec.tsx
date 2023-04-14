import { PaymentMethodForm } from '.'
import { createRenderer } from 'react-test-renderer/shallow'
import React from 'react'
import { View } from 'react-native'

jest.mock('react-native-gradients', () => ({
  LinearGradient: 'LinearGradient',
}))
jest.mock('../../../animation', () => ({
  Fade: ({ children }: any) => <View>{children}</View>,
}))

describe('PaymentMethodForm', () => {
  const renderer = createRenderer()
  const saveForm = jest.fn()
  jest.spyOn(React, 'useRef').mockReturnValue({ current: { save: saveForm } })
  it('should render correctly', () => {
    renderer.render(<PaymentMethodForm paymentMethod="sepa" data={{}} onSubmit={jest.fn()} />)
    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
