import i18n from '../utils/i18n'
import { MatchUndone } from './MatchUndone'
import { OfferTaken } from './OfferTaken'

export const appOverlays = {
  offerTaken: { title: i18n('search.popups.offerTaken.title'), content: OfferTaken },
  matchUndone: { title: i18n('search.popups.matchUndone.title'), content: MatchUndone },
  offerCanceled: { title: i18n('offer.canceled.popup.title'), content: undefined },
}

export type AppPopupId = keyof typeof appOverlays
