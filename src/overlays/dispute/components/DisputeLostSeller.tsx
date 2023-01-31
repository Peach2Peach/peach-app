import React, { ReactElement } from 'react'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type DisputeLostSellerProps = {
  tradeId: string
}

export const DisputeLostSeller = ({ tradeId }: DisputeLostSellerProps): ReactElement => (
  <>
    <Text>{i18n('dispute.seller.lost.text.1', tradeId)}</Text>
    <Text style={tw`mt-3`}>{i18n('dispute.seller.lost.text.2')}</Text>
    <Text style={tw`mt-3`}>{i18n('dispute.seller.lost.text.3')}</Text>
  </>
)
