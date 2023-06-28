import { View } from 'react-native'
import { OpenWallet } from '../../../../components/bitcoin'
import { BitcoinAddressInput } from '../../../../components/inputs'
import { FixedHeightText } from '../../../../components/text'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'

type Props = {
  address: string
  setAddress: (address: string) => void
  addressErrors?: string[]
}
export const SendTo = ({ address, setAddress, addressErrors }: Props) => (
  <View style={tw`gap-4 items-center`}>
    <FixedHeightText height={8} style={tw`button-medium`}>
      {i18n('wallet.withdrawTo')}:
    </FixedHeightText>
    <View style={tw`gap-1 items-center`}>
      <BitcoinAddressInput onChange={setAddress} value={address} errorMessage={addressErrors} />
      <OpenWallet />
    </View>
  </View>
)
