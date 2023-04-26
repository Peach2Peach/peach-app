import { getOfferLevel } from '../../../utils'
import { TradeTheme } from '../../../utils/getThemeForTradeItem'

export const getLevel = (tradeTheme: TradeTheme, offerSummary?: OfferSummary, isHistoryItem = true) =>
  isHistoryItem || !offerSummary ? tradeTheme.level : getOfferLevel(offerSummary)
