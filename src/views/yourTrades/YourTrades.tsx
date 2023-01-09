import React, { ReactElement, useState } from 'react'
import { SectionList, View } from 'react-native'
import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SectionHeader } from './components/SectionHeader'
import { TradeItem } from './components/TradeItem'
import { useYourTradesSetup } from './useYourTradesSetup'
import { isOpenOffer, isPastOffer } from './utils'
import { getCategories } from './utils/getCategories'

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
            renderSectionHeader={SectionHeader}
            renderItem={TradeItem}
          />
        )}
      </View>
    </>
  )
}
