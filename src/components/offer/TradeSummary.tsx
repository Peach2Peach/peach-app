import React, { ReactElement } from 'react'
import tw from '../../styles/tailwind'

import { isTradeCanceled, isTradeComplete } from '../../utils/contract/status'
import Card from '../Card'
import { ClosedTrade } from './ClosedTrade'
import { OpenTrade } from './OpenTrade'

export type TradeSummaryProps = ComponentProps & {
  contract: Contract
  view?: ContractViewer
}

export const TradeSummary = ({ contract, view, style }: TradeSummaryProps): ReactElement => (
  <Card style={[tw`p-7 pt-8`, style]}>
    {!isTradeComplete(contract) && !isTradeCanceled(contract) ? (
      <OpenTrade {...{ contract, view }} />
    ) : (
      <ClosedTrade {...{ contract, view }} />
    )}
  </Card>
)
