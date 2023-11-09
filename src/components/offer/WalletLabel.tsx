import tw from '../../styles/tailwind'
import { Text } from '../text'
import { useWalletLabel } from './useWalletLabel'

export function WalletLabel ({ label, address }: { label: string | undefined; address: string }) {
  const walletLabel = useWalletLabel({ label, address })
  return <Text style={tw`text-center subtitle-1`}>{walletLabel}</Text>
}
