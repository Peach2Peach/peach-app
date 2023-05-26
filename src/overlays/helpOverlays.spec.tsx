import { PayoutAddressPopup } from './info/PayoutAddressPopup'
import { AcceptMatchPopup } from './info/AcceptMatchPopup'
import { CashTrades } from './info/CashTrades'
import { FileBackupPopup } from './info/FileBackupPopup'
import { helpOverlays } from './helpOverlays'
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

describe('HelpOverlays', () => {
  it('should have the correct address signing help overlay', () => {
    expect(helpOverlays.addressSigning.title).toBe('address signing')
    expect(helpOverlays.addressSigning.content).toBe(AddressSigning)
  })

  it('should have the correct accept match help overlay', () => {
    expect(helpOverlays.acceptMatch.title).toBe('accept match = start trade')
    expect(helpOverlays.acceptMatch.content).toBe(AcceptMatchPopup)
  })

  it('should have the correct buying and selling help overlay', () => {
    expect(helpOverlays.sellingBitcoin.title).toBe('selling bitcoin')
    expect(helpOverlays.sellingBitcoin.content).toBe(SellingBitcoin)
  })

  it('should have the correct buying bitcoin help overlay', () => {
    expect(helpOverlays.buyingBitcoin.title).toBe('buying bitcoin')
    expect(helpOverlays.buyingBitcoin.content).toBe(BuyingBitcoin)
  })

  it('should have the correct cash trades help overlay', () => {
    expect(helpOverlays.cashTrades.title).toBe('trading cash')
    expect(helpOverlays.cashTrades.content).toBe(CashTrades)
  })

  it('should have the correct confirm payment help overlay', () => {
    expect(helpOverlays.confirmPayment.title).toBe('payment received?')
    expect(helpOverlays.confirmPayment.content).toBe(ConfirmPayment)
  })

  it('should have the correct currencies help overlay', () => {
    expect(helpOverlays.currencies.title).toBe('accepted currencies')
    expect(helpOverlays.currencies.content).toBe(CurrenciesHelp)
  })

  it('should have the correct escrow help overlay', () => {
    expect(helpOverlays.escrow.title).toBe('Peach escrow')
    expect(helpOverlays.escrow.content).toBe(Escrow)
  })

  it('should have the correct file backup help overlay', () => {
    expect(helpOverlays.fileBackup.title).toBe('making a backup')
    expect(helpOverlays.fileBackup.content).toBe(FileBackupPopup)
  })

  it('should have the correct match match match help overlay', () => {
    expect(helpOverlays.matchmatchmatch.title).toBe('match, match & match again')
    expect(helpOverlays.matchmatchmatch.content).toBe(MatchMatchMatch)
  })

  it('should have the correct make payment help overlay', () => {
    expect(helpOverlays.makePayment.title).toBe('pay up quick!')
    expect(helpOverlays.makePayment.content).toBe(MakePayment)
  })

  it('should have the correct mempool help overlay', () => {
    expect(helpOverlays.mempool.title).toBe('the mempool')
    expect(helpOverlays.mempool.content).toBe(Mempool)
  })

  it('should have the correct my badges help overlay', () => {
    expect(helpOverlays.myBadges.title).toBe('Peach badges')
    expect(helpOverlays.myBadges.content).toBe(MyBadges)
  })

  it('should have the correct network fees help overlay', () => {
    expect(helpOverlays.networkFees.title).toBe('bitcoin network fees')
    expect(helpOverlays.networkFees.content).toBe(NetworkFees)
  })

  it('should have the correct payment methods help overlay', () => {
    expect(helpOverlays.paymentMethods.title).toBe('payment methods')
    expect(helpOverlays.paymentMethods.content).toBe(PaymentMethodsHelp)
  })

  it('should have the correct payout address help overlay', () => {
    expect(helpOverlays.payoutAddress.title).toBe('custom payout wallet')
    expect(helpOverlays.payoutAddress.content).toBe(PayoutAddressPopup)
  })

  it('should have the correct premium help overlay', () => {
    expect(helpOverlays.premium.title).toBe('the price is relative')
    expect(helpOverlays.premium.content).toBe(Premium)
  })

  it('should have the correct referrals help overlay', () => {
    expect(helpOverlays.referrals.title).toBe('Peach referral points')
    expect(helpOverlays.referrals.content).toBe(ReferralsHelp)
  })

  it('should have the correct seed phrase help overlay', () => {
    expect(helpOverlays.seedPhrase.title).toBe('seed phrase?')
    expect(helpOverlays.seedPhrase.content).toBe(SeedPhrasePopup)
  })

  it('should have the correct trading limit help overlay', () => {
    expect(helpOverlays.tradingLimit.title).toBe('trading limits')
    expect(helpOverlays.tradingLimit.content).toBe(TradingLimit)
  })

  it('should have the correct withdrawing funds help overlay', () => {
    expect(helpOverlays.withdrawingFunds.title).toBe('sending funds')
    expect(helpOverlays.withdrawingFunds.content).toBe(WithdrawingFundsHelp)
  })

  it('should have the correct your password help overlay', () => {
    expect(helpOverlays.yourPassword.title).toBe('your password')
    expect(helpOverlays.yourPassword.content).toBe(YourPassword)
  })
})
