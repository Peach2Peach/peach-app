import { TouchableOpacity, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Icon } from '../../../components/Icon'
import { Placeholder } from '../../../components/Placeholder'
import { Loading } from '../../../components/animation/Loading'
import { BTCAmount } from '../../../components/bitcoin/BTCAmount'
import { PeachText } from '../../../components/text/PeachText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { useWalletState } from '../../../utils/wallet/walletStore'

type Props = {
  amount: number
  isRefreshing?: boolean
}
export const TotalBalance = ({ amount, isRefreshing }: Props) => {
  const [showBalance, toggleShowBalance] = useWalletState(
    (state) => [state.showBalance, state.toggleShowBalance],
    shallow,
  )

  return (
    <View style={tw`items-center self-stretch justify-center gap-4 grow`}>
      <View style={[tw`flex-row items-center self-stretch justify-center gap-14px`, isRefreshing && tw`opacity-50`]}>
        <Placeholder style={tw`w-5 h-5`} />
        <PeachText style={tw`text-center button-medium`}>{i18n('wallet.totalBalance')}:</PeachText>
        <TouchableOpacity
          accessibilityHint={i18n(showBalance ? 'wallet.hideBalance' : 'wallet.showBalance')}
          onPress={toggleShowBalance}
        >
          <Icon id={showBalance ? 'eyeOff' : 'eye'} size={20} color={tw.color('black-50')} />
        </TouchableOpacity>
      </View>
      {isRefreshing && <Loading style={tw`absolute w-16 h-16`} />}
      <BTCAmount amount={amount} size="large" showAmount={showBalance} style={isRefreshing && tw`opacity-50`} />
    </View>
  )
}
