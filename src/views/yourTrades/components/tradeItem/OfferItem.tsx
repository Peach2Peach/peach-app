import { TradeSummaryCard } from '../../../../components/lists/TradeSummaryCard'
import { offerIdToHex } from '../../../../utils/offer'
import { useNavigateToOffer } from '../../hooks/useNavigateToOffer'
import { TradeTheme } from '../../utils/getThemeForTradeItem'
import { getAction, getLevel } from './utils'

type Props = {
  offerSummary: OfferSummary
  tradeTheme: TradeTheme
  icon: JSX.Element | undefined
  theme: 'light' | undefined
}

export const OfferItem = ({ offerSummary, tradeTheme, icon, theme }: Props) => {
  const { tradeStatus, amount, creationDate, id } = offerSummary
  const navigateToOffer = useNavigateToOffer(offerSummary)

  return (
    <TradeSummaryCard
      title={offerIdToHex(id)}
      level={getLevel(tradeTheme, offerSummary)}
      date={new Date(creationDate)}
      action={getAction(offerSummary, navigateToOffer, tradeStatus)}
      {...{ amount, icon, theme }}
    />
  )
}
