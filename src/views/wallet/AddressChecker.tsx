import { View } from 'react-native'
import { NewHeader, Screen, Text } from '../../components'
import { BitcoinAddressInput } from '../../components/inputs'
import { useValidatedState } from '../../hooks'
import tw from '../../styles/tailwind'

export const AddressChecker = () => {
  const [address, setAddress, , errorMessage] = useValidatedState('', { bitcoinAddress: true })

  return (
    <Screen>
      <NewHeader title="address checker" />
      <InfoFrame />
      <BitcoinAddressInput value={address} onChange={setAddress} errorMessage={errorMessage} />
      <AddressInfo address={address} />
    </Screen>
  )
}

function InfoFrame () {
  return (
    <View style={tw`border`}>
      <Text>Enter a Bitcoin address to check if it is valid. If it is valid, you will see the address</Text>
    </View>
  )
}

function AddressInfo ({ address }: { address: string }) {
  // const isMine = peachWallet?.isMine(address)
  const isMine = false

  return (
    <View style={tw`border`}>
      <Text>Address: {address}</Text>
      <Text>Is mine: {isMine ? 'true' : 'false'}</Text>
    </View>
  )
}
