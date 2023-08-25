import { SectionList, View } from 'react-native'
import { NewHeader as Header, Loading, Screen } from '../../components'

import { TabbedNavigation, TabbedNavigationItem } from '../../components/navigation/TabbedNavigation'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { SectionHeader } from './components/SectionHeader'
import { TradePlaceholders } from './components/TradePlaceholders'
import { TradeItem } from './components/tradeItem'
import { useYourTradesSetup } from './hooks/useYourTradesSetup'
import { checkMessages } from './utils/checkMessages'
import { getCategories } from './utils/getCategories'

export const YourTrades = () => {
  const { openOffers, pastOffers, isLoading, refetch, tabs, currentTab, setCurrentTab } = useYourTradesSetup()

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
    <Screen>
      <Header title={i18n('yourTrades.title')} hideGoBackButton />
      <TabbedNavigation
        items={tabs}
        select={switchTab}
        selected={currentTab}
        messages={checkMessages(openOffers, pastOffers)}
      />
      {getCurrentData().length > 0 ? (
        <SectionList
          contentContainerStyle={[tw`bg-transparent py-7`, isLoading && tw`opacity-60`]}
          onRefresh={refetch}
          refreshing={false}
          showsVerticalScrollIndicator={false}
          sections={getCategories(getCurrentData())}
          renderSectionHeader={SectionHeader}
          renderSectionFooter={() => <View style={tw`bg-transparent h-7`} />}
          renderItem={TradeItem}
          ItemSeparatorComponent={() => <View onStartShouldSetResponder={() => true} style={tw`h-6`} />}
        />
      ) : (
        <TradePlaceholders tab={currentTab.id as TradeTab} />
      )}
      {isLoading && (
        <View style={tw`absolute inset-0 items-center justify-center`} pointerEvents="none">
          <Loading />
        </View>
      )}
    </Screen>
  )
}
