import { useRef, useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Icon } from '../../components'
import tw from '../../styles/tailwind'
import { useWalletState } from '../../utils/wallet/walletStore'
import { useLastUnusedAddress } from './hooks/useLastUnusedAddress'
import { useWalletAddress } from './hooks/useWalletAddress'

export function AddressLabelInput ({ index }: { index: number }) {
  const { data } = useLastUnusedAddress()
  const showChevronsLeft = !!data && index >= data.index + 2
  const showChevronsRight = !!data && index <= data.index - 2

  const { data: currentAddress } = useWalletAddress(index)
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useWalletState(
    (state) => [state.addressLabelMap[currentAddress?.address ?? ''] ?? `address #${index + 1}`, state.labelAddress],
    shallow,
  )

  const $input = useRef<TextInput>(null)

  const onChangeText = (text: string) => {
    if (currentAddress?.address) {
      setLabel(currentAddress.address, text)
    }
  }

  const onIconPress = () => {
    if (isEditing) {
      setIsEditing(false)
      $input.current?.blur()
    } else {
      setIsEditing(true)
      $input.current?.focus()
    }
  }

  return (
    <View
      style={[
        tw`flex-row items-center justify-center flex-1 gap-1`,
        showChevronsLeft && tw`pr-6`,
        showChevronsRight && tw`pl-6`,
      ]}
    >
      <TextInput
        value={label}
        onChangeText={onChangeText}
        ref={$input}
        style={tw`overflow-hidden leading-relaxed text-center body-l text-black-1`}
      />
      <TouchableOpacity onPress={onIconPress}>
        <Icon id={isEditing ? 'checkSquare' : 'edit3'} color={tw`text-primary-main`.color} size={16} />
      </TouchableOpacity>
    </View>
  )
}
