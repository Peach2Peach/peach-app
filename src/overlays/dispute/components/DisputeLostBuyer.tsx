import React, { ReactElement } from 'react'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type DisputeLostBuyerProps = {
  tradeId: string
}

export const DisputeLostBuyer = ({ tradeId }: DisputeLostBuyerProps): ReactElement => (
  <>
    <Text>{i18n('dispute.buyer.lost.text.1', tradeId)}</Text>
    <Text style={tw`mt-3`}>{i18n('dispute.buyer.lost.text.2')}</Text>
  </>
)
