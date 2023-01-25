import React from 'react'
import i18n from '../../../utils/i18n'
import Button from '../../Button'
import { useMatchOffer } from '../hooks'
import { isBuyOffer } from '../../../utils/offer'

export const MatchOfferButton = ({ offer, currentMatch }: { offer: BuyOffer | SellOffer; currentMatch: Match }) => {
  const { mutate: matchOffer, isLoading } = useMatchOffer(offer, currentMatch)
  return (
    <Button
      title={i18n(
        `search.${isBuyOffer(offer) ? (currentMatch?.matched ? 'waitingForSeller' : 'matchOffer') : 'acceptMatch'}`,
      )}
      wide={false}
      disabled={currentMatch?.matched || isLoading}
      loading={isLoading}
      onPress={matchOffer}
    />
  )
}
