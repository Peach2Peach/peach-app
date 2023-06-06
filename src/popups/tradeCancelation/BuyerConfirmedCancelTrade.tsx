import { View } from 'react-native'
import { Text } from '../../components'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getEscrowExpiry } from '../../utils/offer'

type BuyerConfirmedCancelTradeProps = {
  contract: Contract
}
export const BuyerConfirmedCancelTrade = ({ contract }: BuyerConfirmedCancelTradeProps) => {
  const sellOffer = getSellOfferFromContract(contract)
  const expiry = getEscrowExpiry(sellOffer)
  return (
    <View>
      <Text>{i18n('contract.cancel.buyer.canceled.text.1')}</Text>
      {!expiry.isExpired && <Text>{i18n('contract.cancel.buyer.canceled.text.2')}</Text>}
    </View>
  )
}
