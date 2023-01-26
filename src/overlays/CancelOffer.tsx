import React from 'react'
import { Text } from '../components'
import { useSettingsStore } from '../store/settingsStore'
import i18n from '../utils/i18n'
import { isBuyOffer } from '../utils/offer'

export const CancelOffer = ({ offer }: { offer: BuyOffer | SellOffer }) => {
  const peachWalletActive = useSettingsStore((state) => state.peachWalletActive)
  const translation = isBuyOffer(offer)
    ? i18n('search.popups.cancelOffer.text.buy')
    : i18n('search.popups.cancelOffer.text.sell', `${offer.returnAddress}`, `${peachWalletActive ? 'Peach' : 'custom'}`)
  return <Text>{translation}</Text>
}
