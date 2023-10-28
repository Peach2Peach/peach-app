import { SectionList, View } from 'react-native'
import { Header, Loading, Screen } from '../../components'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useEffect, useMemo } from 'react'
import { NotificationBubble } from '../../components/bubble/NotificationBubble'
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
const tabs = ['yourTrades.buy', 'yourTrades.sell', 'yourTrades.history'] as const

const tabbedNavigationScreenOptions = {
  tabBarLabelStyle: tw`lowercase input-title`,
  tabBarStyle: [tw`bg-transparent mx-sm`, tw.md`mx-md`],
  tabBarContentContainerStyle: tw`bg-transparent`,
  tabBarIndicatorStyle: tw`bg-black-1`,
  tabBarItemStyle: tw`p-0`,
  tabBarPressColor: 'transparent',
}

export const YourTrades = () => {
  const { tradeSummaries, isLoading, error, refetch } = useTradeSummaries()
  const { params } = useRoute<'yourTrades'>()
  const showErrorBanner = useShowErrorBanner()

  useEffect(() => {
    if (error) showErrorBanner(parseError(error))
  }, [error, showErrorBanner])

  const allOpenOffers = useMemo(
    () => tradeSummaries.filter(({ tradeStatus }) => isOpenOffer(tradeStatus)),
    [tradeSummaries],
  )
  const summaries = useMemo(
    () => ({
      'yourTrades.buy': allOpenOffers.filter(({ type }) => type === 'bid'),
      'yourTrades.sell': allOpenOffers.filter(({ type }) => type === 'ask'),
      'yourTrades.history': getPastOffers(tradeSummaries),
    }),
    [allOpenOffers, tradeSummaries],
  )

  return (
    <Screen style={tw`px-0`} header={<YourTradesHeader />} showFooter>
      <YourTradesTab.Navigator
        initialRouteName={params?.tab || 'yourTrades.buy'}
        screenOptions={tabbedNavigationScreenOptions}
        sceneContainerStyle={[tw`px-sm`, tw.md`px-md`]}
      >
        {tabs.map((tab) => (
          <YourTradesTab.Screen
            key={tab}
            name={tab}
            options={{
              title: `${i18n(tab)}`,
              tabBarBadge: () => <TabBarBadge summaries={summaries[tab]} />,
            }}
            children={() => (
              <View style={tw`grow`} onStartShouldSetResponder={() => true}>
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
              </View>
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

function TabBarBadge ({ summaries }: { summaries: TradeSummary[] }) {
  const notifications = useMemo(
    () =>
      summaries.reduce((acc, curr) => {
        if ('unreadMessages' in curr && curr.unreadMessages) {
          acc += curr.unreadMessages
        }
        return acc
      }, 0),
    [summaries],
  )
  return <NotificationBubble notifications={notifications} />
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
