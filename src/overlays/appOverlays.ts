import i18n from '../utils/i18n'
import { OfferTaken } from './OfferTaken'

export const appOverlays = {
  offerTaken: { title: i18n('search.popups.offerTaken.title'), content: OfferTaken },
}

export type AppPopupId = keyof typeof appOverlays
