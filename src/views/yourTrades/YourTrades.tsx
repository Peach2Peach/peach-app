import { SectionList, View } from 'react-native'
import { Header, Loading, Screen } from '../../components'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useEffect } from 'react'
import { TabBar } from '../../components/ui/TabBar'
import { useNavigation, useRoute } from '../../hooks'
import { useTradeSummaries } from '../../hooks/query/useTradeSummaries'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { headerIcons } from '../../utils/layout'
import { parseError } from '../../utils/result'
import { SectionHeader } from './components/SectionHeader'
import { TradePlaceholders } from './components/TradePlaceholders'
import { TradeItem } from './components/tradeItem'
import { getPastOffers, isOpenOffer } from './utils'
import { getCategories } from './utils/getCategories'

const YourTradesTab = createMaterialTopTabNavigator()
const tabs = ['buy', 'sell', 'history'] as const

export const YourTrades = () => {
  const { tradeSummaries, isLoading, error, refetch } = useTradeSummaries()
  const showErrorBanner = useShowErrorBanner()
  useEffect(() => {
    if (error) showErrorBanner(parseError(error))
  }, [error, showErrorBanner])

  const { params } = useRoute<'yourTrades'>()
  const allOpenOffers = tradeSummaries.filter(({ tradeStatus }) => isOpenOffer(tradeStatus))
  const summaries = {
    buy: allOpenOffers.filter(({ type }) => type === 'bid'),
    sell: allOpenOffers.filter(({ type }) => type === 'ask'),
    history: getPastOffers(tradeSummaries),
  }

  return (
    <Screen style={tw`px-0`} header={<YourTradesHeader />} showFooter>
      <YourTradesTab.Navigator
        initialRouteName={params?.tab || 'buy'}
        tabBar={TabBar}
        sceneContainerStyle={[tw`px-sm`, tw.md`px-md`]}
      >
        {tabs.map((tab) => (
          <YourTradesTab.Screen
            key={tab}
            name={`yourTrades.${tab}`}
            children={() => (
              <>
                {summaries[tab].length > 0 ? (
                  <SectionList
                    contentContainerStyle={[tw`bg-transparent py-7`, isLoading && tw`opacity-60`]}
                    onRefresh={refetch}
                    refreshing={false}
                    showsVerticalScrollIndicator={false}
                    sections={getCategories(summaries[tab])}
                    renderSectionHeader={SectionHeader}
                    renderSectionFooter={() => <View style={tw`bg-transparent h-7`} />}
                    renderItem={TradeItem}
                    ItemSeparatorComponent={() => <View onStartShouldSetResponder={() => true} style={tw`h-6`} />}
                  />
                ) : (
                  <TradePlaceholders tab={tab} />
                )}
              </>
            )}
          />
        ))}
      </YourTradesTab.Navigator>
      {isLoading && (
        <View style={tw`absolute inset-0 items-center justify-center`} pointerEvents="none">
          <Loading />
        </View>
      )}
    </Screen>
  )
}

function YourTradesHeader () {
  const navigation = useNavigation()
  const onPress = () => {
    navigation.navigate('exportTradeHistory')
  }
  return (
    <Header
      title={i18n('yourTrades.title')}
      icons={[
        {
          ...headerIcons.share,
          onPress,
          accessibilityHint: `${i18n('goTo')} ${i18n('exportTradeHistory.title')}`,
        },
      ]}
      hideGoBackButton
    />
  )
}
