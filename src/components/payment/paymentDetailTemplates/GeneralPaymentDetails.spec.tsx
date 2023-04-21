import { createRenderer } from 'react-test-renderer/shallow'
import { GeneralPaymentDetails } from './GeneralPaymentDetails'

describe('GeneralPaymentDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should render sepa data', () => {
    const paymentData: SEPAData & Partial<PaymentData> = {
      beneficiary: 'Hal Finney',
      iban: 'IE29 AIBK 9311 5212 3456 78',
      bic: 'AAAABBCC',
    }
    const renderer = createRenderer()
    renderer.render(
      <GeneralPaymentDetails disputeActive={false} paymentMethod="sepa" paymentData={paymentData as PaymentData} />,
    )

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render payment data with reference', () => {
    const paymentData: SEPAData & Partial<PaymentData> = {
      beneficiary: 'Hal Finney',
      iban: 'IE29 AIBK 9311 5212 3456 78',
      bic: 'AAAABBCC',
      reference: 'Do not mention peach or bitcoin',
    }
    const renderer = createRenderer()
    renderer.render(
      <GeneralPaymentDetails disputeActive={false} paymentMethod="sepa" paymentData={paymentData as PaymentData} />,
    )

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render paypal data', () => {
    const paymentData: PaypalData & Partial<PaymentData> = {
      beneficiary: 'Lao-tzu',
      user: '@laotzu',
      email: 'laotzu@tao.com',
    }
    const renderer = createRenderer()
    renderer.render(
      <GeneralPaymentDetails disputeActive={false} paymentMethod="paypal" paymentData={paymentData as PaymentData} />,
    )

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render revolut data', () => {
    const paymentData: RevolutData & Partial<PaymentData> = {
      beneficiary: 'Lao-tzu',
      userName: '@laotzu',
    }
    const renderer = createRenderer()
    renderer.render(
      <GeneralPaymentDetails disputeActive={false} paymentMethod="revolut" paymentData={paymentData as PaymentData} />,
    )

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render template 3 data', () => {
    const paymentData: RevolutData & Partial<PaymentData> = {
      beneficiary: 'Lao-tzu',
      phone: '+4209485798',
    }
    const renderer = createRenderer()
    renderer.render(
      <GeneralPaymentDetails disputeActive={false} paymentMethod="twint" paymentData={paymentData as PaymentData} />,
    )

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render National Transfer data', () => {
    const paymentData: NationalTransferData & Partial<PaymentData> = {
      beneficiary: 'Lao-tzu',
      accountNumber: 'AIBK 9311 5212 3456 78',
      bic: 'AAAABBCC',
    }
    const renderer = createRenderer()
    renderer.render(
      <GeneralPaymentDetails
        disputeActive={false}
        paymentMethod="nationalTransferBE"
        paymentData={paymentData as PaymentData}
      />,
    )

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render Amazon Gift Card data', () => {
    const paymentData: AmazonGiftCardData & Partial<PaymentData> = {
      email: 'jeffb@amazon.com',
    }
    const renderer = createRenderer()
    renderer.render(
      <GeneralPaymentDetails
        disputeActive={false}
        paymentMethod="giftCard.amazon.DE"
        paymentData={paymentData as PaymentData}
      />,
    )

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render Faster Payments data', () => {
    const paymentData: FasterPaymentsData & Partial<PaymentData> = {
      beneficiary: 'Lao-tzu',
      ukBankAccount: 'ukBankAccount',
      ukSortCode: 'ukSortCode',
    }
    const renderer = createRenderer()
    renderer.render(
      <GeneralPaymentDetails
        disputeActive={false}
        paymentMethod="fasterPayments"
        paymentData={paymentData as PaymentData}
      />,
    )

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
})
