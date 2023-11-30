import { View } from 'react-native'
import { Icon, InfoFrame, Loading, Placeholder, Screen } from '../../components'
import { BitcoinAddressInput } from '../../components/inputs'
import { TradeInfo } from '../../components/offer'
import { useValidatedState } from '../../hooks'
import { useIsMyAddress } from '../../hooks/wallet/useIsMyAddress'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { rules } from '../../utils/validation'

const addressRules = {
  bitcoinAddress: true,
}

export const AddressChecker = () => {
  const [address, setAddress, , errorMessage] = useValidatedState<string>('', addressRules)

  return (
    <Screen header={i18n('wallet.addressChecker')}>
      <View style={tw`items-center justify-center gap-16 grow`}>
        <InfoFrame text={i18n('wallet.addressChecker.hint')} />
        <BitcoinAddressInput value={address} onChange={setAddress} errorMessage={errorMessage} />
        <AddressInfo address={address} />
      </View>
    </Screen>
  )
}

function AddressInfo ({ address }: { address: string }) {
  const isMine = useIsMyAddress(address)

  return (
    <View>
      {isMine === undefined ? (
        rules.bitcoinAddress(address) ? (
          <Loading style={tw`w-6 h-6`} />
        ) : (
          <Placeholder style={tw`h-24px`} />
        )
      ) : (
        <TradeInfo
          text={i18n(isMine ? 'wallet.addressChecker.belongsToWallet' : 'wallet.addressChecker.doesNotbelongToWallet')}
          IconComponent={
            <Icon
              size={20}
              id={isMine ? 'checkSquare' : 'xSquare'}
              color={tw.color(isMine ? 'success-main' : 'error-main')}
            />
          }
        />
      )}
    </View>
  )
}
