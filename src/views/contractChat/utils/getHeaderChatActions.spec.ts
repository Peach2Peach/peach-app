import { contract as mockContract } from '../../../../tests/unit/data/contractData'
import tw from '../../../styles/tailwind'
import { getHeaderChatActions } from './getHeaderChatActions'

// eslint-disable-next-line max-lines-per-function
describe('getHeaderChatActions', () => {
  it('should return empty array if dispute is active', () => {
    const contract = {
      ...mockContract,
      disputeActive: true,
    }
    const showCancelPopup = jest.fn()
    const showOpenDisputePopup = jest.fn()
    const view = 'buyer'
    const result = getHeaderChatActions(contract, showCancelPopup, showOpenDisputePopup, view)
    expect(result).toEqual([])
  })
  it('should return correctly if contract not canceled, payment not made, can cancel and raise dispute', () => {
    const contract = {
      ...mockContract,
      disputeActive: false,
      canceled: false,
      cancelationRequested: false,
      paymentMade: null,
      paymentMethod: 'sepa' as const,
    }
    const showCancelPopup = jest.fn()
    const showOpenDisputePopup = jest.fn()
    const view = 'buyer'
    const result = getHeaderChatActions(contract, showCancelPopup, showOpenDisputePopup, view)
    expect(result).toEqual([
      { id: 'xCircle', color: '#9F8C82', onPress: expect.any(Function) },
      { id: 'alertOctagon', color: '#DF321F', onPress: expect.any(Function) },
    ])
  })
  it("should return correctly if contract not canceled, payment not made, can't cancel or raise dispute", () => {
    const contract = {
      ...mockContract,
      disputeActive: false,
      canceled: false,
      symmetricKey: undefined,
      cancelationRequested: true,
      paymentMade: null,
      paymentMethod: 'sepa' as const,
    }
    const showCancelPopup = jest.fn()
    const showOpenDisputePopup = jest.fn()
    const view = 'seller'
    const result = getHeaderChatActions(contract, showCancelPopup, showOpenDisputePopup, view)
    expect(result).toEqual([
      { id: 'xCircle', color: '#9F8C82', style: tw`opacity-50`, onPress: expect.any(Function) },
      { id: 'alertOctagon', color: '#DF321F', style: tw`opacity-50`, onPress: expect.any(Function) },
    ])
  })
  it('should show cancel popup if contract can be canceled', () => {
    const contract = {
      ...mockContract,
      disputeActive: false,
      canceled: false,
      cancelationRequested: false,
      paymentMade: null,
      paymentMethod: 'sepa' as const,
    }
    const showCancelPopup = jest.fn()
    const showOpenDisputePopup = jest.fn()
    const view = 'buyer'
    const result = getHeaderChatActions(contract, showCancelPopup, showOpenDisputePopup, view)
    result?.[0].onPress()
    expect(showCancelPopup).toHaveBeenCalled()
  })
  it('should show open dispute popup if contract can be disputed', () => {
    const contract = {
      ...mockContract,
      disputeActive: false,
      canceled: false,
      cancelationRequested: false,
      paymentMade: null,
      paymentMethod: 'sepa' as const,
    }
    const showCancelPopup = jest.fn()
    const showOpenDisputePopup = jest.fn()
    const view = 'buyer'
    const result = getHeaderChatActions(contract, showCancelPopup, showOpenDisputePopup, view)
    result?.[1].onPress()
    expect(showOpenDisputePopup).toHaveBeenCalled()
  })
  it("should not show cancel popup if contract can't be canceled", () => {
    const contract = {
      ...mockContract,
      disputeActive: false,
      canceled: false,
      cancelationRequested: true,
      paymentMade: null,
      paymentMethod: 'sepa' as const,
    }
    const showCancelPopup = jest.fn()
    const showOpenDisputePopup = jest.fn()
    const view = 'buyer'
    const result = getHeaderChatActions(contract, showCancelPopup, showOpenDisputePopup, view)
    result?.[0].onPress()
    expect(showCancelPopup).not.toHaveBeenCalled()
  })
  it("should not show open dispute popup if contract can't be disputed", () => {
    const contract = {
      ...mockContract,
      disputeActive: false,
      canceled: false,
      cancelationRequested: true,
      symmetricKey: undefined,
      paymentMade: null,
      paymentMethod: 'sepa' as const,
    }
    const showCancelPopup = jest.fn()
    const showOpenDisputePopup = jest.fn()
    const view = 'buyer'
    const result = getHeaderChatActions(contract, showCancelPopup, showOpenDisputePopup, view)
    result?.[1].onPress()
    expect(showOpenDisputePopup).not.toHaveBeenCalled()
  })
})
