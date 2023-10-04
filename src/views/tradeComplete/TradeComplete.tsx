import { TouchableOpacity, View } from 'react-native'
import { Icon, Text } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Rate } from './components/Rate'
import { useTradeCompleteSetup } from './hooks/useTradeCompleteSetup'

export const TradeComplete = () => {
  const { view, vote, setVote, contract, saveAndUpdate } = useTradeCompleteSetup()

  return (
    <View style={tw`items-center justify-between h-full px-8 pt-5 pb-10`}>
      <View style={tw`items-center`}>
        <Icon id="fullLogo" />
        <Text style={tw`text-center h5 text-primary-background-light`}>
          {i18n(`tradeComplete.title.${view}.default`)}
        </Text>
      </View>

      <Text style={tw`text-center body-l text-primary-background-light`}>{i18n('rate.subtitle')}</Text>
      <View style={tw`flex-row justify-center mt-4`}>
        <TouchableOpacity
          onPress={() => setVote('negative')}
          style={[
            tw`px-4 pb-[13px] pt-[19px] w-16 h-16 items-center justify-center mr-6`,
            tw`border-[3px] border-primary-background-light rounded-[21px]`,
            vote === 'negative' && tw`bg-primary-background-light`,
          ]}
        >
          <Icon
            id="thumbsDown"
            style={tw`w-8 h-8`}
            color={vote === 'negative' ? tw`text-primary-main`.color : tw`text-primary-background-light`.color}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setVote('positive')}
          style={[
            tw`px-4 pt-[13px] pb-[19px] w-16 h-16 items-center justify-center ml-6`,
            tw`border-[3px] border-primary-background-light rounded-[21px]`,
            vote === 'positive' && tw`bg-primary-background-light`,
          ]}
        >
          <Icon
            id="thumbsUp"
            style={tw`w-8 h-8`}
            color={vote === 'positive' ? tw`text-primary-main`.color : tw`text-primary-background-light`.color}
          />
        </TouchableOpacity>
      </View>
      <Rate {...{ contract, view, vote, saveAndUpdate }} />
    </View>
  )
}
