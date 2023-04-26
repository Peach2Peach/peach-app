import { getOfferLevel, isPastOffer } from '../../../utils'
import { TradeTheme } from '../../../utils/getThemeForTradeItem'

export const getLevel = (tradeTheme: TradeTheme, offerSummary?: OfferSummary) =>
  !offerSummary || isPastOffer(offerSummary.tradeStatus) ? tradeTheme.level : getOfferLevel(offerSummary)
