import { isMe } from './isMe'

export const getTradingPartner = ({ buyer, seller }: Contract) => (isMe(seller.id) ? buyer : seller)
