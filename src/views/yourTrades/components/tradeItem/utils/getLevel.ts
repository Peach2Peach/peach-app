import { getOfferLevel, isPastOffer } from '../../../utils'
import { TradeTheme } from '../../../utils/getThemeForTradeItem'

export const getLevel = ({ level }: Pick<TradeTheme, 'level'>, offerSummary?: OfferSummary) =>
  !offerSummary || isPastOffer(offerSummary.tradeStatus) ? level : getOfferLevel(offerSummary)
