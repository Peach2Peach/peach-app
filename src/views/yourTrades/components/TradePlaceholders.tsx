import { ReactElement } from 'react';
import { TouchableOpacity, View } from 'react-native'
import { useNavigation } from '../../../hooks'
import { HorizontalLine, Icon, Text } from '../../../components'
import i18n from '../../../utils/i18n'
import tw from '../../../styles/tailwind'
type TradePlaceholdersProps = ComponentProps & {
  tab: TradeTab
}
export const TradePlaceholders = ({ tab }: TradePlaceholdersProps): ReactElement => {
  const navigation = useNavigation()

  const GoTradeButton = (): ReactElement => (
    <TouchableOpacity onPress={() => navigation.navigate(tab as 'buy' | 'sell')} style={tw`flex-row items-center`}>
      <Text style={tw`h6 text-primary-main`}>{i18n(`yourTrades.start.${tab === 'sell' ? 'selling' : 'buying'}`)}</Text>
      <Icon id="arrowRightCircle" style={tw`w-5 h-5 ml-2`} color={tw`text-primary-main`.color} />
    </TouchableOpacity>
  )
  return (
    <View style={tw`items-center justify-center flex-1 px-[60px]`}>
      <Text style={tw`h6 text-black-3`}>{i18n('yourTrades.empty')}</Text>
      {tab === 'buy' || tab === 'sell' ? (
        <>
          <HorizontalLine style={tw`w-full my-8 bg-black-6`} />
          <GoTradeButton />
        </>
      ) : null}
    </View>
  )
}
