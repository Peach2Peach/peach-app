import { Transaction, address } from 'bitcoinjs-lib'
import { useAreMyAddresses } from '../../../hooks/wallet/useIsMyAddress'
import { getNetwork } from '../../../utils/wallet/getNetwork'

type Props = Pick<Transaction, 'outs'> & { incoming: boolean }

export const useGetTransactionDestinationAddress = ({ outs = [], incoming }: Props) => {
  const addresses = outs.map((v) => v.script).map((script) => address.fromOutputScript(script, getNetwork()))

  const areMine = useAreMyAddresses(addresses)

  if (addresses.length === 1) return addresses[0]

  const destinationAddress = addresses.find((a, i) => (incoming ? areMine[i] : !areMine[i]))
  return destinationAddress
}
