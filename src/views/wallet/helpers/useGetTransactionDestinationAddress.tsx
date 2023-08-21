import { useAreMyAddresses } from '../../../hooks/wallet/useIsMyAddress'

type Props = Pick<Transaction, 'vout'> & { incoming: boolean }

export const useGetTransactionDestinationAddress = ({ vout = [], incoming }: Props) => {
  const addresses = vout.map((v) => v.scriptpubkey_address)
  const areMine = useAreMyAddresses(addresses)
  const destinationAddress = addresses.find((a, i) => (incoming ? areMine[i] : !areMine[i]))
  return destinationAddress
}
