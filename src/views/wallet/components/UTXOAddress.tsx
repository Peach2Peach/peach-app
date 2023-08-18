import { useQuery } from '@tanstack/react-query'
import { Address } from 'bdk-rn'
import { Script } from 'bdk-rn/lib/classes/Script'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useWalletState } from '../../../utils/wallet/walletStore'

type Props = {
  script: Script
}

const useUTXOAddress = (script: Script) =>
  useQuery({
    queryKey: ['address', script.id],
    queryFn: async () => {
      try {
        const address = await new Address().fromScript(script, peachWallet.network)
        return await address.asString()
      } catch (e) {
        throw new Error('Error getting address')
      }
    },
  })

export function UTXOAddress ({ script }: Props) {
  const { data: address } = useUTXOAddress(script)
  const addressLabel = useWalletState((state) => (address ? state.addressLabelMap[address] : ''))

  return (
    <Text style={tw`body-s text-black-2`}>
      <Text style={tw`body-s`}>{addressLabel ? `${addressLabel} ‑ ` : ''}</Text>
      {address}
    </Text>
  )
}
