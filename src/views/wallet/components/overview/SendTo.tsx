import { View } from 'react-native'
import { Text } from '../../../../components'
import { OpenWallet } from '../../../../components/bitcoin'
import { BitcoinAddressInput } from '../../../../components/inputs'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type Props = {
  address: string
  setAddress: (address: string) => void
  addressErrors?: string[]
}
export const SendTo = ({ address, setAddress, addressErrors }: Props) => (
  <View style={tw`gap-4 items-center`}>
    <Text style={tw`button-medium`}>{i18n('wallet.withdrawTo')}:</Text>
    <BitcoinAddressInput onChange={setAddress} value={address} errorMessage={addressErrors} />
    <OpenWallet />
  </View>
)
