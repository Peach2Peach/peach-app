import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../components'
import { getSellOfferFromContract } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { getEscrowExpiry } from '../../utils/offer'

type ContractCanceledToSellerProps = {
  contract: Contract
}
export const ContractCanceledToSeller = ({ contract }: ContractCanceledToSellerProps): ReactElement => {
  const sellOffer = getSellOfferFromContract(contract)
  const expiry = getEscrowExpiry(sellOffer)
  return (
    <View>
      <Text>{i18n(`contract.cancel.${contract.canceledBy || 'buyer'}.canceled.text.1`)}</Text>
      {!expiry.isExpired && <Text>{i18n(`contract.cancel.${contract.canceledBy || 'buyer'}.canceled.text.2`)}</Text>}
    </View>
  )
}
