import i18n from '../utils/i18n'
import { MatchUndone } from './app/MatchUndone'
import { OfferTaken } from './app/OfferTaken'
import { ReportSuccess } from './app/ReportSuccess'

export const appOverlays = {
  offerTaken: { title: i18n('search.popups.offerTaken.title'), content: OfferTaken },
  matchUndone: { title: i18n('search.popups.matchUndone.title'), content: MatchUndone },
  reportSuccess: { title: i18n('report.success.title'), content: ReportSuccess },
}

export type AppPopupId = keyof typeof appOverlays
