import { useQuery } from '@tanstack/react-query'
import { View } from 'react-native'
import { Icon, InfoFrame, NewHeader, Placeholder, Screen } from '../../components'
import { BitcoinAddressInput } from '../../components/inputs'
import { TradeInfo } from '../../components/offer'
import { useValidatedState } from '../../hooks'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { rules } from '../../utils/validation'
import { peachWallet } from '../../utils/wallet/setWallet'

const addressRules = {
  bitcoinAddress: true,
}

export const AddressChecker = () => {
  const [address, setAddress, , errorMessage] = useValidatedState('', addressRules)

  return (
    <Screen>
      <NewHeader title={i18n('wallet.addressChecker')} />
      <View style={tw`items-center justify-center gap-16 grow`}>
        <InfoFrame text={i18n('wallet.addressChecker.hint')} />
        <BitcoinAddressInput value={address} onChange={setAddress} errorMessage={errorMessage} />
        <AddressInfo address={address} />
      </View>
    </Screen>
  )
}

function AddressInfo ({ address }: { address: string }) {
  const { data: isMine } = useQuery({
    queryKey: ['isMine', address],
    queryFn: () => peachWallet.isMine(address),
    enabled: !!address && !!peachWallet && rules.bitcoinAddress(true, address),
  })

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
