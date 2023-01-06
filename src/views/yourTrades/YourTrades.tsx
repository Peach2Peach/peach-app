import React, { ReactElement, useMemo, useState } from 'react'
import { FlatList, View } from 'react-native'
import tw from '../../styles/tailwind'
import { useHeaderSetup } from '../../hooks'
import i18n from '../../utils/i18n'
import { getOffers } from '../../utils/offer'
import { OfferItem } from './components/OfferItem'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import { isOpenOffer, isPastOffer } from './utils/overviewUtils'

// TODO : Show offer was messing with the logic and I don't know why
/* const showOffer = (offer: SellOffer | BuyOffer) => {
  if (offer.contractId) return true
  if (isBuyOffer(offer)) return offer.online

  // filter out sell offer which has been canceled before funding escrow
  if (isFundingCanceled(offer) && offer.funding.txIds?.length === 0 && !offer.txId) return false

  return true
}*/

export default (): ReactElement => {
  // Set header
  useHeaderSetup(
    useMemo(
      () => ({
        title: i18n('yourTrades.title'),
        hideGoBackButton: true,
      }),
      [],
    ),
  )
  const offers = getOffers()

  const allOpenOffers = offers.filter((offer) => isOpenOffer(offer))
  const openOffers = {
    buy: allOpenOffers.filter((o) => o.type === 'bid'),
    sell: allOpenOffers.filter((o) => o.type === 'ask'),
  }
  const pastOffers = offers.filter((offer) => isPastOffer(offer))

  const tabs: TabbedNavigationItem[] = [
    {
      id: 'buy',
      display: i18n('yourTrades.buy'),
    },
    {
      id: 'sell',
      display: i18n('yourTrades.sell'),
    },
    {
      id: 'history',
      display: i18n('yourTrades.history'),
    },
  ]
  const [currentTab, setCurrentTab] = useState(tabs[0])

  const getCurrentData = () => {
    switch (currentTab.id) {
    case 'buy':
      return openOffers.buy
    case 'sell':
      return openOffers.sell
    default:
      return pastOffers
    }
  }

  return (
    <>
      <TabbedNavigation items={tabs} select={setCurrentTab} selected={currentTab} />
      <View style={tw`p-5`}>
        {allOpenOffers.length + pastOffers.length === 0 ? (
          // TODO : EMPTY PLACEHOLDER
          <View />
        ) : (
          <FlatList
            ItemSeparatorComponent={() => <View style={tw`h-5`} />}
            data={getCurrentData()}
            renderItem={({ item }) => <OfferItem key={item.id} extended={true} offer={item} />}
          />
        )}
      </View>
    </>
  )
}
