import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Input, Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type CustomFeeItemProps = {
  customFeeRate: string
  setCustomFeeRate: React.Dispatch<string>
  disabled?: boolean
}

export default ({ customFeeRate, setCustomFeeRate, disabled }: CustomFeeItemProps): ReactElement => (
  <View style={tw`flex flex-row items-center h-8`}>
    <Text style={tw`subtitle-1`}>{i18n('settings.networkFees.custom')}:</Text>
    <View style={tw`h-8 mx-2`}>
      <Input
        style={tw`w-16 h-8`}
        {...{
          value: customFeeRate,
          onChange: setCustomFeeRate,
          required: true,
          disabled,
        }}
      />
    </View>
    <Text style={tw`text-black-2`}>{i18n('satsPerByte')}</Text>
  </View>
)
