import { createRenderer } from 'react-test-renderer/shallow'
import { GeneralPaymentDetails } from './GeneralPaymentDetails'
import { act, fireEvent, render } from '@testing-library/react-native'
import { Linking } from 'react-native'

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
    renderer.render(<GeneralPaymentDetails paymentMethod="sepa" paymentData={paymentData as PaymentData} />)

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
    renderer.render(<GeneralPaymentDetails paymentMethod="sepa" paymentData={paymentData as PaymentData} />)

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
    renderer.render(<GeneralPaymentDetails paymentMethod="paypal" paymentData={paymentData as PaymentData} />)

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render revolut data', () => {
    const paymentData: RevolutData & Partial<PaymentData> = {
      beneficiary: 'Lao-tzu',
      userName: '@laotzu',
    }
    const renderer = createRenderer()
    renderer.render(<GeneralPaymentDetails paymentMethod="revolut" paymentData={paymentData as PaymentData} />)

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })
  it('should render template 3 data', () => {
    const paymentData: RevolutData & Partial<PaymentData> = {
      beneficiary: 'Lao-tzu',
      phone: '+4209485798',
    }
    const renderer = createRenderer()
    renderer.render(<GeneralPaymentDetails paymentMethod="twint" paymentData={paymentData as PaymentData} />)

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
      <GeneralPaymentDetails paymentMethod="nationalTransferBE" paymentData={paymentData as PaymentData} />,
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
      <GeneralPaymentDetails paymentMethod="giftCard.amazon.DE" paymentData={paymentData as PaymentData} />,
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
    renderer.render(<GeneralPaymentDetails paymentMethod="fasterPayments" paymentData={paymentData as PaymentData} />)

    const result = renderer.getRenderOutput()
    expect(result).toMatchSnapshot()
  })

  it('should open app link when there is a fallback url and an app link', async () => {
    const paymentData: FasterPaymentsData & Partial<PaymentData> = {
      beneficiary: 'Satoshi',
      ukBankAccount: 'ukBankAccount',
      ukSortCode: 'ukSortCode',
    }
    const { getByText } = render(
      <GeneralPaymentDetails
        paymentMethod="fasterPayments"
        paymentData={paymentData as PaymentData}
        fallbackUrl={'https://www.google.com'}
        appLink={'https://www.peachbitcoin.com'}
      />,
    )

    const link = getByText('Satoshi')
    await act(async () => {
      fireEvent.press(link)
    })

    expect(Linking.openURL).toHaveBeenCalledWith('https://www.peachbitcoin.com')
  })

  it('should not open app link when there is no fallback url and no app link', async () => {
    const paymentData: FasterPaymentsData & Partial<PaymentData> = {
      beneficiary: 'Satoshi',
      ukBankAccount: 'ukBankAccount',
      ukSortCode: 'ukSortCode',
    }
    const { getByText } = render(
      <GeneralPaymentDetails paymentMethod="fasterPayments" paymentData={paymentData as PaymentData} />,
    )

    const link = getByText('Satoshi')
    await act(async () => {
      fireEvent.press(link)
    })

    expect(Linking.openURL).not.toHaveBeenCalled()
  })

  it('should open fallback url when there is no app link', async () => {
    const paymentData: FasterPaymentsData & Partial<PaymentData> = {
      beneficiary: 'Satoshi',
      ukBankAccount: 'ukBankAccount',
      ukSortCode: 'ukSortCode',
    }
    const { getByText } = render(
      <GeneralPaymentDetails
        paymentMethod="fasterPayments"
        paymentData={paymentData as PaymentData}
        fallbackUrl={'https://www.google.com'}
      />,
    )

    const link = getByText('Satoshi')
    await act(async () => {
      fireEvent.press(link)
    })

    expect(Linking.openURL).toHaveBeenCalledWith('https://www.google.com')
  })

  it('should not open app link when there is no fallback url', async () => {
    const paymentData: FasterPaymentsData & Partial<PaymentData> = {
      beneficiary: 'Satoshi',
      ukBankAccount: 'ukBankAccount',
      ukSortCode: 'ukSortCode',
    }
    const { getByText } = render(
      <GeneralPaymentDetails
        paymentMethod="fasterPayments"
        paymentData={paymentData as PaymentData}
        appLink={'https://www.peachbitcoin.com'}
      />,
    )

    const link = getByText('Satoshi')
    await act(async () => {
      fireEvent.press(link)
    })

    expect(Linking.openURL).not.toHaveBeenCalled()
  })
})
