import { PayoutAddressPopup } from './info/PayoutAddressPopup'
import { AcceptMatchPopup } from './info/AcceptMatchPopup'
import { CashTrades } from './info/CashTrades'
import { FileBackupPopup } from './info/FileBackupPopup'
import { helpPopups } from './helpPopups'
import { AddressSigning } from './info/AddressSigning'
import { BuyingBitcoin } from './info/BuyingBitcoin'
import { ConfirmPayment } from './info/ConfirmPayment'
import { CurrenciesHelp } from './info/CurrenciesHelp'
import { Escrow } from './info/Escrow'
import { MakePayment } from './info/MakePayment'
import { MatchMatchMatch } from './info/MatchMatchMatch'
import { Mempool } from './info/Mempool'
import { MyBadges } from './info/MyBadges'
import { NetworkFees } from './info/NetworkFees'
import { PaymentMethodsHelp } from './info/PaymentMethodsHelp'
import { Premium } from './info/Premium'
import { ReferralsHelp } from './info/ReferralsHelp'
import { SeedPhrasePopup } from './info/SeedPhrasePopup'
import { SellingBitcoin } from './info/SellingBitcoin'
import { TradingLimit } from './info/TradingLimit'
import { WithdrawingFundsHelp } from './info/WithdrawingFundsHelp'
import { YourPassword } from './info/YourPassword'

describe('helpPopups', () => {
  it('should have the correct address signing help popup', () => {
    expect(helpPopups.addressSigning.title).toBe('address signing')
    expect(helpPopups.addressSigning.content).toBe(AddressSigning)
  })

  it('should have the correct accept match help popup', () => {
    expect(helpPopups.acceptMatch.title).toBe('accept match = start trade')
    expect(helpPopups.acceptMatch.content).toBe(AcceptMatchPopup)
  })

  it('should have the correct buying and selling help popup', () => {
    expect(helpPopups.sellingBitcoin.title).toBe('selling bitcoin')
    expect(helpPopups.sellingBitcoin.content).toBe(SellingBitcoin)
  })

  it('should have the correct buying bitcoin help popup', () => {
    expect(helpPopups.buyingBitcoin.title).toBe('buying bitcoin')
    expect(helpPopups.buyingBitcoin.content).toBe(BuyingBitcoin)
  })

  it('should have the correct cash trades help popup', () => {
    expect(helpPopups.cashTrades.title).toBe('trading cash')
    expect(helpPopups.cashTrades.content).toBe(CashTrades)
  })

  it('should have the correct confirm payment help popup', () => {
    expect(helpPopups.confirmPayment.title).toBe('payment received?')
    expect(helpPopups.confirmPayment.content).toBe(ConfirmPayment)
  })

  it('should have the correct currencies help popup', () => {
    expect(helpPopups.currencies.title).toBe('accepted currencies')
    expect(helpPopups.currencies.content).toBe(CurrenciesHelp)
  })

  it('should have the correct escrow help popup', () => {
    expect(helpPopups.escrow.title).toBe('Peach escrow')
    expect(helpPopups.escrow.content).toBe(Escrow)
  })

  it('should have the correct file backup help popup', () => {
    expect(helpPopups.fileBackup.title).toBe('making a backup')
    expect(helpPopups.fileBackup.content).toBe(FileBackupPopup)
  })

  it('should have the correct match match match help popup', () => {
    expect(helpPopups.matchmatchmatch.title).toBe('match, match & match again')
    expect(helpPopups.matchmatchmatch.content).toBe(MatchMatchMatch)
  })

  it('should have the correct make payment help popup', () => {
    expect(helpPopups.makePayment.title).toBe('pay up quick!')
    expect(helpPopups.makePayment.content).toBe(MakePayment)
  })

  it('should have the correct mempool help popup', () => {
    expect(helpPopups.mempool.title).toBe('the mempool')
    expect(helpPopups.mempool.content).toBe(Mempool)
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
    expect(helpPopups.payoutAddress.content).toBe(PayoutAddressPopup)
  })

  it('should have the correct premium help popup', () => {
    expect(helpPopups.premium.title).toBe('the price is relative')
    expect(helpPopups.premium.content).toBe(Premium)
  })

  it('should have the correct referrals help popup', () => {
    expect(helpPopups.referrals.title).toBe('Peach referral points')
    expect(helpPopups.referrals.content).toBe(ReferralsHelp)
  })

  it('should have the correct seed phrase help popup', () => {
    expect(helpPopups.seedPhrase.title).toBe('seed phrase?')
    expect(helpPopups.seedPhrase.content).toBe(SeedPhrasePopup)
  })

  it('should have the correct trading limit help popup', () => {
    expect(helpPopups.tradingLimit.title).toBe('trading limits')
    expect(helpPopups.tradingLimit.content).toBe(TradingLimit)
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
