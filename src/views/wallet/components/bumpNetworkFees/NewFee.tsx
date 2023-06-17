import { Dispatch } from 'react'
import { Text } from '../../../../components'
import { NumberInput } from '../../../../components/inputs'
import i18n from '../../../../utils/i18n'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'

type Props = {
  newFeeRate: string
  setNewFeeRate: Dispatch<string>
}

export const NewFee = ({ newFeeRate, setNewFeeRate }: Props) => (
  <View style={tw`flex-row justify-center items-center gap-2`}>
    <Text style={tw`subtitle-1`}>{i18n('wallet.bumpNetworkFees.newFee')}</Text>
    <View style={tw`h-9`}>
      <NumberInput
        style={tw`w-24 h-9`}
        {...{
          value: newFeeRate,
          placeholder: '',
          onChange: setNewFeeRate,
          required: true,
        }}
      />
    </View>
    <Text style={tw`text-black-3`}>{i18n('satPerByte')}</Text>
  </View>
)
