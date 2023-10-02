import { isMe } from './isMe'

export const getOfferIdFromContract = (contract: Pick<Contract, 'id' | 'seller'>) =>
  contract.id.split('-')[isMe(contract.seller.id) ? 0 : 1]
