import React, { ReactElement, useMemo, useState } from 'react'
import { FlatList, View } from 'react-native'
import tw from '../../styles/tailwind'
import { useHeaderSetup, useNavigation } from '../../hooks'
import i18n from '../../utils/i18n'
import { info } from '../../utils/log'
import { getOffers, isBuyOffer } from '../../utils/offer'
import { getOfferStatus, isFundingCanceled } from '../../utils/offer/status'
import { OfferItem } from './components/OfferItem'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'

const isPastOffer = (offer: SellOffer | BuyOffer) => {
  const { status } = getOfferStatus(offer)

  return /tradeCompleted|tradeCanceled|offerCanceled/u.test(status)
}
const isOpenOffer = (offer: SellOffer | BuyOffer) => !isPastOffer(offer)
const showOffer = (offer: SellOffer | BuyOffer) => {
  if (offer.contractId) return true
  if (isBuyOffer(offer)) return offer.online

  // filter out sell offer which has been canceled before funding escrow
  if (isFundingCanceled(offer) && offer.funding.txIds?.length === 0 && !offer.txId) return false

  return true
}

const statusPriority = ['escrowWaitingForConfirmation', 'offerPublished', 'searchingForPeer', 'match', 'contractCreated']

const sortByStatus = (a: SellOffer | BuyOffer, b: SellOffer | BuyOffer) =>
  statusPriority.indexOf(getOfferStatus(a).status) - statusPriority.indexOf(getOfferStatus(b).status)

export default (): ReactElement => {
  const navigation = useNavigation()
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

  const allOpenOffers = offers.filter(isOpenOffer).filter(showOffer)
    .sort(sortByStatus)
  const openOffers = {
    buy: allOpenOffers.filter((o) => o.type === 'bid'),
    sell: allOpenOffers.filter((o) => o.type === 'ask'),
  }
  const pastOffers = offers.filter(isPastOffer).filter(showOffer)

  /*
  useFocusEffect(
    useCallback(
      getOffersEffect({
        onSuccess: (result) => {
          if (!result?.length) return

          saveOffers(result)
          storeOffers(getAccount().offers)

          setLastUpdate(new Date().getTime())
          updateAppContext({
            notifications: getChatNotifications() + getRequiredActionCount(),
          })
        },
        onError: (err) => {
          error('Could not fetch offer information')

          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
        },
      }),
      [],
    ),
  )

  useFocusEffect(
    useCallback(
      getContractsEffect({
        onSuccess: (result) => {
          if (!result?.length) return

          saveContracts(result)
          storeContracts(getAccount().contracts)
          setLastUpdate(new Date().getTime())
          updateAppContext({
            notifications: getChatNotifications() + getRequiredActionCount(),
          })
        },
        onError: (err) => {
          error('Could not fetch contract information')
          updateMessage({
            msgKey: err.error || 'GENERAL_ERROR',
            level: 'ERROR',
            action: {
              callback: () => navigation.navigate('contact'),
              label: i18n('contactUs'),
              icon: 'mail',
            },
          })
        },
      }),
      [],
    ),
  )*/

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
    info('data -> ' + JSON.stringify(openOffers))
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

  /* <PeachScrollView contentContainerStyle={tw`px-12`}>
      <View style={tw`pt-5 pb-10`}>
        {allOpenOffers.length + pastOffers.length === 0 ? (
          <Text style={tw`text-center`}>{i18n('yourTrades.noOffers')}</Text>
        ) : null}
        {openOffers.buy.length ? (
          <Headline style={tw`mt-20 text-grey-1`}>
            {i18n('yourTrades.open')}
            <Headline style={tw`text-green`}> {i18n('yourTrades.buy')} </Headline>
            {i18n('yourTrades.offers')}
          </Headline>
        ) : null}
        {openOffers.buy.map((offer) => (
          <OfferItem key={offer.id} style={tw`mt-3`} extended={true} offer={offer} />
        ))}
        {openOffers.sell.length ? (
          <Headline style={tw`mt-20 text-grey-1`}>
            {i18n('yourTrades.open')}
            <Headline style={tw`text-red`}> {i18n('yourTrades.sell')} </Headline>
            {i18n('yourTrades.offers')}
          </Headline>
        ) : null}
        {openOffers.sell.map((offer) => (
          <OfferItem key={offer.id} style={tw`mt-3`} extended={true} offer={offer} />
        ))}
        {pastOffers.length ? <Headline style={tw`mt-20 text-grey-1`}>{i18n('yourTrades.pastOffers')}</Headline> : null}
        {pastOffers.map((offer) => (
          <OfferItem key={offer.id} extended={false} style={tw`mt-3`} offer={offer} />
        ))}
      </View>
    </PeachScrollView>*/
  )
}
