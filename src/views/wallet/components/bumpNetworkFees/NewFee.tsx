import { Dispatch } from 'react'
import { Text } from '../../../../components'
import { NumberInput } from '../../../../components/inputs'
import i18n from '../../../../utils/i18n'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { round } from '../../../../utils/math'

type Props = {
  newFeeRate: string
  setNewFeeRate: Dispatch<string>
  overpayingBy?: number
}

export const NewFee = ({ newFeeRate, setNewFeeRate, overpayingBy = 0 }: Props) => (
  <>
    <View style={tw`flex-row items-center justify-center gap-2 pt-2`}>
      <Text style={tw`subtitle-1`}>{i18n('wallet.bumpNetworkFees.newFee')}</Text>
      <View style={tw`h-9`}>
        <NumberInput
          style={tw`w-24 h-9`}
          value={newFeeRate}
          decimals={2}
          placeholder=""
          onChange={setNewFeeRate}
          required={true}
        />
      </View>
      <Text style={tw`text-center text-black-3`}>{i18n('satPerByte')}</Text>
    </View>
    <Text style={[tw`text-center text-primary-main`, overpayingBy < 1 && tw`opacity-0`]}>
      {i18n('wallet.bumpNetworkFees.overPayingBy', String(round(overpayingBy * 100)))}
    </Text>
  </>
)
