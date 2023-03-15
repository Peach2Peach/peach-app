import tw from '../../../styles/tailwind'
import { getDisputeResultTheme } from '.'

describe('getDisputeResultTheme', () => {
  const wonAsBuyer = {
    type: 'bid',
    disputeWinner: 'buyer',
  }
  const wonAsSeller = {
    type: 'ask',
    disputeWinner: 'seller',
  }

  const lostAsBuyer = {
    type: 'bid',
    disputeWinner: 'seller',
  }

  const lostAsSeller = {
    type: 'ask',
    disputeWinner: 'buyer',
  }

  it('returns the correct theme for a contract summary where you won the dispute as buyer', () => {
    const theme = getDisputeResultTheme(wonAsBuyer as ContractSummary)
    expect(theme).toEqual({
      icon: 'buy',
      level: 'SUCCESS',
      color: tw`text-success-main`.color,
    })
  })

  it('returns the correct theme for a contract summary where you won the dispute as seller', () => {
    const theme = getDisputeResultTheme(wonAsSeller as ContractSummary)
    expect(theme).toEqual({
      icon: 'sell',
      level: 'APP',
      color: tw`text-primary-main`.color,
    })
  })
  it('returns the correct theme for a contract summary where you lost the dispute', () => {
    const themeBuyer = getDisputeResultTheme(lostAsBuyer as ContractSummary)
    expect(themeBuyer).toEqual({
      icon: 'alertOctagon',
      level: 'WARN',
      color: tw`text-warning-main`.color,
    })
    const themeSeller = getDisputeResultTheme(lostAsSeller as ContractSummary)
    expect(themeSeller).toEqual({
      icon: 'alertOctagon',
      level: 'WARN',
      color: tw`text-warning-main`.color,
    })
  })
})
