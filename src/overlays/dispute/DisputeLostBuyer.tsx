import React, { ReactElement } from 'react'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type DisputeLostBuyerProps = {
  tradeId: string
}

export const DisputeLostBuyer = ({ tradeId }: DisputeLostBuyerProps): ReactElement => (
  <>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.buyer.lost.text.1', tradeId)}</Text>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.buyer.lost.text.2')}</Text>
  </>
)
