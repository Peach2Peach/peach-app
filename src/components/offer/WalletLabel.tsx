import tw from '../../styles/tailwind'
import { PeachText } from '../text/PeachText'
import { useWalletLabel } from './useWalletLabel'

export function WalletLabel ({ label, address }: { label: string | undefined; address: string }) {
  const walletLabel = useWalletLabel({ label, address })
  return <PeachText style={tw`text-center subtitle-1`}>{walletLabel}</PeachText>
}
