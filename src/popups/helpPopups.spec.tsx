import { render } from 'test-utils'
import i18n from '../utils/i18n'
import { helpPopups } from './helpPopups'
import { Escrow } from './info/Escrow'
import { MyBadges } from './info/MyBadges'
import { NetworkFees } from './info/NetworkFees'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { ReferralsHelp } from './info/ReferralsHelp'
import { SeedPhrasePopup } from './info/SeedPhrasePopup'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'
import { YourPassword } from './info/YourPassword'

describe('helpPopups', () => {
  it('should have the correct accept match help popup', () => {
    expect(helpPopups.acceptMatch.title).toBe('accept match = start trade')
    expect(helpPopups.acceptMatch.content).toBe(i18n('search.popups.acceptMatch.text'))
  })

  it('should have the correct cash trades help popup', () => {
    const CashTrades = helpPopups.cashTrades.content
    expect(helpPopups.cashTrades.title).toBe('trading cash')
    const { queryByText } = render(<CashTrades />)
    expect(queryByText(i18n('tradingCash.text'))).toBeTruthy()
  })

  it('should have the correct currencies help popup', () => {
    expect(helpPopups.currencies.title).toBe('accepted currencies')
    expect(helpPopups.currencies.content).toBe(i18n('help.currency.description'))
  })

  it('should have the correct escrow help popup', () => {
    expect(helpPopups.escrow.title).toBe('Peach escrow')
    expect(helpPopups.escrow.content).toBe(Escrow)
  })

  it('should have the correct file backup help popup', () => {
    expect(helpPopups.fileBackup.title).toBe('making a backup')
    expect(helpPopups.fileBackup.content).toBe(i18n('settings.backups.fileBackup.popup.content'))
  })

  it('should have the correct match match match help popup', () => {
    expect(helpPopups.matchmatchmatch.title).toBe('match, match & match again')
    expect(helpPopups.matchmatchmatch.content).toBe(i18n('search.popups.matchmatchmatch.text'))
  })

  it('should have the correct my badges help popup', () => {
    expect(helpPopups.myBadges.title).toBe('Peach badges')
    expect(helpPopups.myBadges.content).toBe(MyBadges)
  })

  it('should have the correct network fees help popup', () => {
    expect(helpPopups.networkFees.title).toBe('bitcoin network fees')
    expect(helpPopups.networkFees.content).toBe(NetworkFees)
  })

  it('should have the correct payment methods help popup', () => {
    expect(helpPopups.paymentMethods.title).toBe('payment methods')
    expect(helpPopups.paymentMethods.content).toBe(PaymentMethodsHelp)
  })

  it('should have the correct payout address help popup', () => {
    expect(helpPopups.payoutAddress.title).toBe('custom payout wallet')
    expect(helpPopups.payoutAddress.content).toBe(i18n('settings.payoutAddress.popup'))
  })

  it('should have the correct referrals help popup', () => {
    expect(helpPopups.referrals.title).toBe('Peach referral points')
    expect(helpPopups.referrals.content).toBe(ReferralsHelp)
  })

  it('should have the correct seed phrase help popup', () => {
    expect(helpPopups.seedPhrase.title).toBe('seed phrase?')
    expect(helpPopups.seedPhrase.content).toBe(SeedPhrasePopup)
  })

  it('should have the correct withdrawing funds help popup', () => {
    expect(helpPopups.withdrawingFunds.title).toBe('sending funds')
    expect(helpPopups.withdrawingFunds.content).toBe(WithdrawingFundsHelp)
  })

  it('should have the correct your password help popup', () => {
    expect(helpPopups.yourPassword.title).toBe('your password')
    expect(helpPopups.yourPassword.content).toBe(YourPassword)
  })
})
