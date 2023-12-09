import { TouchableOpacity, View } from 'react-native'
import { HorizontalLine, Icon, Text } from '../../../components'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
type TradePlaceholdersProps = ComponentProps & {
  tab: TradeTab
}
const GoTradeButton = ({ tab }: { tab: 'yourTrades.buy' | 'yourTrades.sell' }) => {
  const navigation = useNavigation()
  const destination
    = tab === 'yourTrades.buy' ? (['homeScreen', { screen: 'home' }] as const) : (['sellOfferPreferences'] as const)

  const onPress = () => {
    navigation.navigate(...destination)
  }

  return (
    <TouchableOpacity onPress={onPress} style={tw`flex-row items-center`}>
      <Text style={tw`h6 text-primary-main`}>
        {i18n(`yourTrades.start.${tab === 'yourTrades.sell' ? 'selling' : 'buying'}`)}
      </Text>
      <Icon id="arrowRightCircle" style={tw`w-5 h-5 ml-2`} color={tw.color('primary-main')} />
    </TouchableOpacity>
  )
}
export const TradePlaceholders = ({ tab }: TradePlaceholdersProps) => (
  <View style={tw`items-center justify-center flex-1`}>
    <Text style={tw`h6 text-black-3`}>{i18n('yourTrades.empty')}</Text>
    {(tab === 'yourTrades.buy' || tab === 'yourTrades.sell') && (
      <>
        <HorizontalLine style={tw`w-full my-8 bg-black-6`} />
        <GoTradeButton tab={tab} />
      </>
    )}
  </View>
)
