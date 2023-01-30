import React, { ReactElement } from 'react'
import { Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

type DisputeWonProps = {
  tradeId: string
}

export default ({ tradeId }: DisputeWonProps): ReactElement => (
  <>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.won.text.1', tradeId)}</Text>
    <Text style={tw`mb-3 body-m text-black-1`}>{i18n('dispute.won.text.2')}</Text>
  </>
)
