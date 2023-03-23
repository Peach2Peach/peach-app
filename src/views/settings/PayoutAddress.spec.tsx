import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import PayoutAddress from './PayoutAddress'

const usePayoutAddressSetupMock = jest.fn()
jest.mock('./hooks/usePayoutAddressSetup', () => ({
  usePayoutAddressSetup: () => usePayoutAddressSetupMock(),
}))

describe('PayoutAddress', () => {
  const defaultReturnValue = {
    type: 'payout',
    address: 'address',
    setAddress: jest.fn(),
    addressErrors: '',
    addressValid: true,
    addressLabel: 'addressLabel',
    setAddressLabel: jest.fn(),
    addressLabelErrors: '',
    addressLabelValid: true,
    isUpdated: false,
    save: jest.fn(),
  }
  const renderer = ShallowRenderer.createRenderer()

  it('should render correctly', () => {
    usePayoutAddressSetupMock.mockReturnValueOnce(defaultReturnValue)
    renderer.render(<PayoutAddress />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })

  it('should render correctly when isUpdated is true', () => {
    usePayoutAddressSetupMock.mockReturnValueOnce({ ...defaultReturnValue, isUpdated: true })
    renderer.render(<PayoutAddress />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })

  it('should render correctly when type is refund', () => {
    usePayoutAddressSetupMock.mockReturnValueOnce({ ...defaultReturnValue, type: 'refund' })
    renderer.render(<PayoutAddress />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
