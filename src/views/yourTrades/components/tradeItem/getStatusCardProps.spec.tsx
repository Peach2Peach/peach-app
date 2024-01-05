import { ContractSummary } from '../../../../../peach-api/src/@types/contract'
import { OfferSummary } from '../../../../../peach-api/src/@types/offer'
import { getStatusCardProps } from './getStatusCardProps'

const mockItem: OfferSummary | ContractSummary = {
  amount: 21,
  creationDate: new Date('2021-08-01'),
  currency: 'EUR',
  id: '21',
  type: 'ask',
  lastModified: new Date('2021-08-01'),
  matches: [],
  tradeStatus: 'searchingForPeer',
}

describe('getStatusCardProps', () => {
  it('should return an object with the right keys', () => {
    const result = getStatusCardProps(mockItem)
    expect(result).toHaveProperty('title')
    expect(result).toHaveProperty('icon')
    expect(result).toHaveProperty('subtext')
    expect(result).toHaveProperty('label')
    expect(result).toHaveProperty('labelIcon')
    expect(result).toHaveProperty('color')
  })
})
