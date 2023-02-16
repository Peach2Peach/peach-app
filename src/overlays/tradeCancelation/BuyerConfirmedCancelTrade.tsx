import React, { ReactElement } from 'react'
import { Text } from '../../components'
import { contractIdToHex } from '../../utils/contract'
import i18n from '../../utils/i18n'
import { thousands } from '../../utils/string'

type BuyerConfirmedCancelTradeProps = {
  contract: Contract
}
export const BuyerConfirmedCancelTrade = ({ contract }: BuyerConfirmedCancelTradeProps): ReactElement => (
  <Text>{i18n('contract.cancel.buyer.canceled.text', contractIdToHex(contract.id), thousands(contract.amount))}</Text>
)
