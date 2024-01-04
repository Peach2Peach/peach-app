import { View } from 'react-native'
import { Icon } from '../../../components/Icon'
import { BTCAmount } from '../../../components/bitcoin/btcAmount/BTCAmount'
import { PeachText } from '../../../components/text/PeachText'
import { CENT } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { round } from '../../../utils/math/round'

const NoChangeWarning = () => (
  <View style={tw`flex-row gap-4 items-center`}>
    <Icon id="alertTriangle" size={32} color={tw.color('black-100')} />
    <PeachText>{i18n('wallet.bumpNetworkFees.confirmRbf.noChange')}</PeachText>
  </View>
)

type Props = {
  oldFeeRate: number
  newFeeRate: number
  bytes: number
  sendingAmount: number
  hasNoChange?: boolean
}

export const ConfirmRbf = ({ oldFeeRate, newFeeRate, bytes, sendingAmount, hasNoChange }: Props) => {
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
        <PeachText style={tw`text-primary-main`}>
          {i18n('wallet.bumpNetworkFees.confirmRbf.percentOfTx', String(round((oldFee / sendingAmount) * CENT, 1)))}
        </PeachText>
      </View>
      <PeachText>
        <PeachText style={tw`font-baloo-bold`}>{i18n('wallet.bumpNetworkFees.confirmRbf.newFee')}</PeachText>
        {'\n\n'}
        {newFeeRate} {i18n('satPerByte')} * {bytes} {i18n('bytes')} =
      </PeachText>
      <View>
        <BTCAmount amount={newFee} size="medium" />
        <PeachText style={tw`text-primary-main`}>
          {i18n('wallet.bumpNetworkFees.confirmRbf.percentOfTx', String(round((newFee / sendingAmount) * CENT, 1)))}
        </PeachText>
      </View>
      {hasNoChange && <NoChangeWarning />}
    </View>
  )
}
