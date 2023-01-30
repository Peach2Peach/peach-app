import React, { ReactElement } from 'react'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type DisputeLostSellerProps = {
  tradeId: string
}

export const DisputeLostSeller = ({ tradeId }: DisputeLostSellerProps): ReactElement => (
  <>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.seller.lost.text.1', tradeId)}</Text>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.seller.lost.text.2')}</Text>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.seller.lost.text.3')}</Text>
  </>
)
