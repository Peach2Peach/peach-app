import { ReactElement, Dispatch } from 'react'
import { View } from 'react-native'

import { Input, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type CustomFeeItemProps = {
  customFeeRate: string
  setCustomFeeRate: Dispatch<string>
  disabled?: boolean
}

export default ({ customFeeRate, setCustomFeeRate, disabled }: CustomFeeItemProps): ReactElement => (
  <View style={tw`flex flex-row items-center`}>
    <Text style={tw`subtitle-1 leading-base`}>{i18n('settings.networkFees.custom')}:</Text>
    <View style={tw`h-8 mx-2`}>
      <Input
        style={tw`w-16 h-8`}
        {...{
          value: customFeeRate,
          onChange: setCustomFeeRate,
          required: true,
          disabled,
          keyboardType: 'number-pad',
        }}
      />
    </View>
    <Text style={tw`text-black-2`}>{i18n('satsPerByte')}</Text>
  </View>
)
