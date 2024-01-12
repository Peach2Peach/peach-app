import { View } from 'react-native'
import { PeachText } from '../../../../components/text/PeachText'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type Props = {
  feeRate: FeeRate
  estimatedFees: number
}
export const EstimatedFeeItem = ({ feeRate, estimatedFees }: Props) => (
  <View>
    <PeachText style={tw`py-1 subtitle-1 leading-base`}>
      {i18n(`settings.networkFees.estimatedTime.${feeRate}`)}
      <PeachText style={tw`text-black-65 ml-0.5`}>
         ({i18n('settings.networkFees.xSatsPerByte', estimatedFees.toString())})
      </PeachText>
    </PeachText>
  </View>
)
