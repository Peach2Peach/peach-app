import { isMe } from './isMe'

export const getContractViewer = (sellerId: string): ContractViewer => (isMe(sellerId) ? 'seller' : 'buyer')
