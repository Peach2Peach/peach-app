import { useQuery } from '@tanstack/react-query'
import { View } from 'react-native'
import { NewHeader as Header, Icon, InfoFrame, Placeholder, Screen } from '../../components'
import { BitcoinAddressInput } from '../../components/inputs'
import { TradeInfo } from '../../components/offer'
import { useValidatedState } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { rules } from '../../utils/validation'
import { peachWallet } from '../../utils/wallet/setWallet'
import { getScriptPubKeyFromAddress } from '../../utils/wallet/transaction'

const addressRules = {
  bitcoinAddress: true,
}

export const AddressChecker = () => {
  const [address, setAddress, , errorMessage] = useValidatedState('', addressRules)

  return (
    <Screen>
      <Header title={i18n('wallet.addressChecker')} />
      <View style={tw`items-center justify-center gap-16 grow`}>
        <InfoFrame text={i18n('wallet.addressChecker.hint')} />
        <BitcoinAddressInput value={address} onChange={setAddress} errorMessage={errorMessage} />
        <AddressInfo address={address} />
      </View>
    </Screen>
  )
}

const useIsMyAddress = (address: string) => {
  const { data: isMine } = useQuery({
    queryKey: ['isMine', address],
    queryFn: async () => {
      if (!peachWallet?.wallet) throw new Error('Wallet not initialized')
      const script = await getScriptPubKeyFromAddress(address)
      return peachWallet.wallet.isMine(script)
    },
    enabled: !!address && !!peachWallet?.wallet && rules.bitcoinAddress(true, address),
  })

  return isMine
}

function AddressInfo ({ address }: { address: string }) {
  const isMine = useIsMyAddress(address)

  return (
    <View>
      {isMine === undefined ? (
        <Placeholder style={tw`h-24px`} />
      ) : (
        <TradeInfo
          text={i18n(isMine ? 'wallet.addressChecker.belongsToWallet' : 'wallet.addressChecker.doesNotbelongToWallet')}
          IconComponent={
            <Icon
              size={20}
              id={isMine ? 'checkSquare' : 'xSquare'}
              color={(isMine ? tw`text-success-main` : tw`text-error-main`).color}
            />
          }
        />
      )}
    </View>
  )
}
