import { useQueryClient } from '@tanstack/react-query'
import { View } from 'react-native'
import { TouchableIcon } from '../../../components/TouchableIcon'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { peachWallet } from '../../../utils/wallet/setWallet'
import { useLastUnusedAddress, useWalletAddress } from '../hooks'
import { AddressLabelInput } from './AddressLabelInput'

function AddressLabelInputByIndex ({ index, style }: ComponentProps & { index: number }) {
  const fallback = { address: undefined, used: false, index }
  const { data: currentAddress = fallback } = useWalletAddress(index)

  return (
    <View style={[tw`flex-row items-center justify-center flex-1 gap-1`, style]}>
      <AddressLabelInput address={currentAddress.address || i18n('loading')} fallback={`address #${index}`} />
    </View>
  )
}

type Props = {
  setIndex: React.Dispatch<React.SetStateAction<number | undefined>>
  index: number
}
export const AddressNavigation = ({ setIndex, index }: Props) => {
  const { data } = useLastUnusedAddress()
  const queryClient = useQueryClient()
  const showChevronsLeft = !!data && index >= data.index + 2
  const showChevronsRight = !!data && index <= data.index - 2

  const nextAddress = () => {
    setIndex(index + 1)
    queryClient.prefetchQuery(['receiveAddress', index + 2], () => peachWallet.getAddressByIndex(index + 2))
  }

  const prevAddress = () => {
    if (index === 0) return
    setIndex(index - 1)
    if (index > 1) {
      queryClient.prefetchQuery(['receiveAddress', index - 2], () => peachWallet.getAddressByIndex(index - 2))
    }
  }

  const goToLastUnusedAddress = () => {
    if (!data) return
    setIndex(data.index)
  }

  return (
    <View style={tw`flex-row items-center self-stretch justify-between px-1`}>
      <ArrowWrapper>
        {showChevronsLeft && <TouchableIcon id="chevronsLeft" onPress={goToLastUnusedAddress} />}
        <ArrowLeftCircle onPress={prevAddress} index={index} />
      </ArrowWrapper>

      <AddressLabelInputByIndex
        key={`addressLabel-${index}`}
        index={index}
        style={[showChevronsLeft && tw`pr-6`, showChevronsRight && tw`pl-6`]}
      />

      <ArrowWrapper>
        <TouchableIcon id="arrowRightCircle" onPress={nextAddress} />
        {showChevronsRight && <TouchableIcon id="chevronsRight" onPress={goToLastUnusedAddress} />}
      </ArrowWrapper>
    </View>
  )
}

function ArrowWrapper ({ children }: { children: React.ReactNode }) {
  return <View style={tw`flex-row items-center justify-end gap-2px`}>{children}</View>
}

function ArrowLeftCircle ({ onPress, index }: { onPress: () => void; index: number }) {
  return <TouchableIcon id="arrowLeftCircle" iconColor={tw.color('black-2')} onPress={onPress} disabled={index === 0} />
}
