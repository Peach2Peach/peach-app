import React, { ReactElement, useState } from 'react'
import { SectionList, Text, View } from 'react-native'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import LinedText from '../../components/ui/LinedText'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ContractItem } from './components/ContractItem'
import { OfferItem } from './components/OfferItem'
import { useYourTradesSetup } from './useYourTradesSetup'
import { isContractSummary, isOpenAction, isOpenOffer, isPastOffer, isPrioritary, isWaiting } from './utils'

// TODO : Show offer was messing with the logic and I don't know why
/* const showOffer = (offer: SellOffer | BuyOffer) => {
  if (offer.contractId) return true
  if (isBuyOffer(offer)) return offer.online

  // filter out sell offer which has been canceled before funding escrow
  if (isFundingCanceled(offer) && offer.funding.txIds?.length === 0 && !offer.txId) return false

  return true
}*/

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

const getCategories = (trades: TradeSummary[]) => [
  { title: 'priority', data: trades.filter(({ tradeStatus }) => isPrioritary(tradeStatus)) },
  { title: 'openActions', data: trades.filter(({ type, tradeStatus }) => isOpenAction(type, tradeStatus)) },
  { title: 'waiting', data: trades.filter(({ type, tradeStatus }) => isWaiting(type, tradeStatus)) },
]

export default (): ReactElement => {
  const { trades, getTradeSummary } = useYourTradesSetup()

  const allOpenOffers = trades.filter(({ tradeStatus }) => isOpenOffer(tradeStatus))
  const openOffers = {
    buy: allOpenOffers.filter(({ type }) => type === 'bid'),
    sell: allOpenOffers.filter(({ type }) => type === 'ask'),
  }
  const pastOffers = trades.filter(({ tradeStatus }) => isPastOffer(tradeStatus))
  const [currentTab, setCurrentTab] = useState(tabs[0])

  const switchTab = (tab: TabbedNavigationItem) => {
    setCurrentTab(tab)
    getTradeSummary()
  }

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
      <TabbedNavigation items={tabs} select={switchTab} selected={currentTab} />
      <View style={tw`p-7`}>
        {allOpenOffers.length + pastOffers.length === 0 ? (
          // TODO : EMPTY PLACEHOLDER
          <View />
        ) : (
          <SectionList
            sections={getCategories(getCurrentData())}
            renderItem={({ item }) => (
              <View style={tw`mb-3`}>
                {isContractSummary(item) ? (
                  <ContractItem key={item.id} contract={item} />
                ) : (
                  <OfferItem key={item.id} offer={item} />
                )}
              </View>
            )}
            renderSectionHeader={({ section: { title, data } }) =>
              data.length !== 0 && title !== 'priority' ? (
                <LinedText style={tw`my-3`}>
                  <Text style={tw` text-black-2 body-m`}>{i18n(`yourTrades.${title}`)}</Text>
                </LinedText>
              ) : (
                <></>
              )
            }
          />
        )}
      </View>
    </>
  )
}
