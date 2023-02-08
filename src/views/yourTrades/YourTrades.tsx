import React, { ReactElement, useState } from 'react'
import { SectionList, View } from 'react-native'
import { Loading } from '../../components'

import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SectionHeader } from './components/SectionHeader'
import { TradeItem } from './components/TradeItem'
import { useYourTradesSetup } from './hooks/useYourTradesSetup'
import { getCategories } from './utils/getCategories'

const tabs: TabbedNavigationItem[] = [
  { id: 'buy', display: i18n('yourTrades.buy') },
  { id: 'sell', display: i18n('yourTrades.sell') },
  { id: 'history', display: i18n('yourTrades.history') },
]
const getTabById = (id: string) => tabs.find((t) => t.id === id)

export default (): ReactElement => {
  const { allOpenOffers, openOffers, pastOffers, isLoading, refetch, tab } = useYourTradesSetup()

  const [currentTab, setCurrentTab] = useState(getTabById(tab) || tabs[0])

  const switchTab = (t: TabbedNavigationItem) => {
    setCurrentTab(t)
    refetch()
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
    <View style={tw`h-full px-8`}>
      <TabbedNavigation items={tabs} select={switchTab} selected={currentTab} />
      {allOpenOffers.length + pastOffers.length > 0 && (
        <SectionList
          contentContainerStyle={[tw`py-10`, isLoading && tw`opacity-60`]}
          onRefresh={refetch}
          refreshing={false}
          showsVerticalScrollIndicator={false}
          sections={getCategories(getCurrentData())}
          renderSectionHeader={SectionHeader}
          renderItem={TradeItem}
          ItemSeparatorComponent={() => <View style={tw`h-6`} />}
        />
      )}
      {isLoading && (
        <View style={tw`absolute inset-0 items-center justify-center`} pointerEvents="none">
          <Loading />
        </View>
      )}
    </View>
  )
}
