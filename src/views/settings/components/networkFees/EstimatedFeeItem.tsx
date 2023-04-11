import { ReactElement } from 'react'
import { View } from 'react-native'
import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type EstimatedFeeItemProps = {
  feeRate: FeeRate
  estimatedFees: number
}
export default ({ feeRate, estimatedFees }: EstimatedFeeItemProps): ReactElement => (
  <View>
    <Text style={tw`py-1 subtitle-1 leading-base`}>
      {i18n(`settings.networkFees.estimatedTime.${feeRate}`)}
      <Text style={tw`text-black-2 ml-0.5`}>
         ({i18n('settings.networkFees.xSatsPerByte', estimatedFees.toString())})
      </Text>
    </Text>
  </View>
)
