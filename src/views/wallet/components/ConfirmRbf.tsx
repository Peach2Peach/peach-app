import { View } from 'react-native'
import { PeachText } from '../../../components/text/Text'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { BTCAmount } from '../../../components/bitcoin'
import { round } from '../../../utils/math'

type Props = {
  oldFeeRate: number
  newFeeRate: number
  bytes: number
  sendingAmount: number
}

export const ConfirmRbf = ({ oldFeeRate, newFeeRate, bytes, sendingAmount }: Props) => {
  const oldFee = oldFeeRate * bytes
  const newFee = newFeeRate * bytes

  return (
    <View style={tw`gap-3`}>
      <PeachText>
        <PeachText style={tw`font-baloo-bold`}>{i18n('wallet.bumpNetworkFees.confirmRbf.oldFee')}</PeachText>
        {'\n\n'}
        {oldFeeRate} {i18n('satPerByte')} * {bytes} {i18n('bytes')} =
      </PeachText>
      <View>
        <BTCAmount amount={oldFee} size="medium" />
        <PeachText style={tw`text-error-main`}>
          {i18n('wallet.bumpNetworkFees.confirmRbf.percentOfTx', String(round((oldFee / sendingAmount) * 100, 1)))}
        </PeachText>
      </View>
      <PeachText>
        <PeachText style={tw`font-baloo-bold`}>{i18n('wallet.bumpNetworkFees.confirmRbf.newFee')}</PeachText>
        {'\n\n'}
        {newFeeRate} {i18n('satPerByte')} * {bytes} {i18n('bytes')} =
      </PeachText>
      <View>
        <BTCAmount amount={newFee} size="medium" />
        <PeachText style={tw`text-error-main`}>
          {i18n('wallet.bumpNetworkFees.confirmRbf.percentOfTx', String(round((newFee / sendingAmount) * 100, 1)))}
        </PeachText>
      </View>
    </View>
  )
}
