import { Dispatch } from 'react'
import { View } from 'react-native'

import { Text } from '../../../../components'
import { NumberInput } from '../../../../components/inputs'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type Props = {
  customFeeRate?: string
  setCustomFeeRate: Dispatch<string>
  disabled?: boolean
}

export const CustomFeeItem = ({ customFeeRate, setCustomFeeRate, disabled }: Props) => (
  <View style={tw`flex flex-row items-center`}>
    <Text style={tw`subtitle-1 leading-base`}>{i18n('settings.networkFees.custom')}:</Text>
    <View style={tw`h-8 mx-2`}>
      <NumberInput
        style={tw`w-16 h-8`}
        value={customFeeRate}
        onChange={setCustomFeeRate}
        testID="input-custom-fees"
        required
        disabled={disabled}
        decimals={2}
      />
    </View>
    <Text style={tw`text-black-2`}>{i18n('satsPerByte')}</Text>
  </View>
)
