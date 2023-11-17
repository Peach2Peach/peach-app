import { useRef, useState } from 'react'
import { TextInput, TouchableOpacity, View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'
import { useWalletState } from '../../../utils/wallet/walletStore'

type Props = {
  address?: string
  fallback?: string
}

export function AddressLabelInput ({ address, fallback }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [label, setLabel] = useWalletState(
    (state) => [state.addressLabelMap[address ?? ''] ?? fallback, state.labelAddress],
    shallow,
  )

  const $input = useRef<TextInput>(null)

  const onChangeText = (text: string) => {
    setLabel(address, text)
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
    <View style={tw`flex-row items-center justify-center gap-1`}>
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
