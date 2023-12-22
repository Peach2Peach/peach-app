import { TouchableOpacity, View } from 'react-native'
import { Icon } from '../../../components/Icon'
import { PeachText } from '../../../components/text/PeachText'
import { HorizontalLine } from '../../../components/ui/HorizontalLine'
import { useNavigation } from '../../../hooks/useNavigation'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
type TradePlaceholdersProps = ComponentProps & {
  tab: TradeTab
}
const GoTradeButton = ({ tab }: { tab: 'yourTrades.buy' | 'yourTrades.sell' }) => {
  const navigation = useNavigation()
  const destination = tab === 'yourTrades.buy' ? 'buyOfferPreferences' : 'sellOfferPreferences'

  const onPress = () => {
    navigation.navigate(destination)
  }

  return (
    <TouchableOpacity onPress={onPress} style={tw`flex-row items-center`}>
      <PeachText style={tw`h6 text-primary-main`}>
        {i18n(`yourTrades.start.${tab === 'yourTrades.sell' ? 'selling' : 'buying'}`)}
      </PeachText>
      <Icon id="arrowRightCircle" style={tw`w-5 h-5 ml-2`} color={tw.color('primary-main')} />
    </TouchableOpacity>
  )
}
export const TradePlaceholders = ({ tab }: TradePlaceholdersProps) => (
  <View style={tw`items-center justify-center flex-1`}>
    <PeachText style={tw`h6 text-black-50`}>{i18n('yourTrades.empty')}</PeachText>
    {(tab === 'yourTrades.buy' || tab === 'yourTrades.sell') && (
      <>
        <HorizontalLine style={tw`w-full my-8 bg-black-5`} />
        <GoTradeButton tab={tab} />
      </>
    )}
  </View>
)
