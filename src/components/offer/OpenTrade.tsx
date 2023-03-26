import { ReactElement } from 'react';
import { TradeSummaryProps } from './TradeSummary'
import { OpenTradeSeller } from './OpenTradeSeller'
import { OpenTradeBuyer } from './OpenTradeBuyer'

export const OpenTrade = (props: TradeSummaryProps): ReactElement =>
  props.view === 'seller' ? <OpenTradeSeller {...props} /> : <OpenTradeBuyer {...props} />
