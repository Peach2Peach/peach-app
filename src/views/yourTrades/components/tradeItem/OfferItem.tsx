import { SummaryItem } from '../../../../components/lists/SummaryItem'
import i18n from '../../../../utils/i18n'
import { offerIdToHex } from '../../../../utils/offer'
import { useNavigateToOffer } from '../../hooks/useNavigateToOffer'
import { isPastOffer, statusIcons } from '../../utils'
import { TradeTheme } from '../../utils/getThemeForTradeItem'
import { getLevel } from './utils/getLevel'

type Props = {
  offerSummary: OfferSummary
  tradeTheme: TradeTheme
  icon: JSX.Element | undefined
}

export const OfferItem = ({ offerSummary, tradeTheme, icon }: Props) => {
  const { tradeStatus, amount, creationDate, id } = offerSummary
  const navigateToOffer = useNavigateToOffer(offerSummary)
  const isHistoryItem = isPastOffer(tradeStatus)

  const level = getLevel(tradeTheme, offerSummary, isHistoryItem)
  const theme = isHistoryItem ? 'light' : undefined
  const action = {
    callback: navigateToOffer,
    label: isHistoryItem ? undefined : i18n(`offer.requiredAction.${tradeStatus}`),
    icon: isHistoryItem ? undefined : statusIcons[tradeStatus],
  }

  return (
    <SummaryItem title={offerIdToHex(id)} {...{ amount, level, theme, icon, action }} date={new Date(creationDate)} />
  )
}
