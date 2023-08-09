import { TextInput, TouchableOpacity, View } from 'react-native'
import { CopyAble, HorizontalLine, Icon, NewHeader, Screen, Text } from '../../components'
import tw from '../../styles/tailwind'
import QRCode from 'react-native-qrcode-svg'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export const ReceiveBitcoin = () => {
  const [index, setIndex] = useState(0)
  const { data } = useQuery(['receiveAddress', index], () => peachWallet.getAddressByIndex(index))

  return (
    <Screen>
      <ReceiveBitcoinHeader />
      <View style={tw`flex-1 gap-2 my-1 border`}>
        <AddressNavigation setIndex={setIndex} index={index} />

        <HorizontalLine />

        <View>
          <QRCode value={data?.address} />
          <View style={tw`flex-row flex-wrap`}>
            <Text>{data?.address}</Text>
            <CopyAble value={data?.address} style={tw`w-6 h-6`} />
          </View>
        </View>
      </View>
    </Screen>
  )
}

function ReceiveBitcoinHeader () {
  return <NewHeader title="receive bitcoin" />
}

type AddressNavigationProps = {
  setIndex: React.Dispatch<React.SetStateAction<number>>
  index: number
}

function AddressNavigation ({ setIndex, index }: AddressNavigationProps) {
  const nextAddress = () => {
    setIndex(index + 1)
  }

  const prevAddress = () => {
    if (index === 0) return
    setIndex(index - 1)
  }
  return (
    <View style={tw`flex-row items-center justify-between w-full px-1`}>
      <TouchableOpacity onPress={prevAddress} disabled={index === 0}>
        <Icon id="arrowLeftCircle" size={24} color={index === 0 ? tw`text-black-5`.color : tw`text-black-3`.color} />
      </TouchableOpacity>
      <View style={tw`flex-row items-center justify-center`}>
        <TextInput value={`address #${index + 1}`} style={tw``} />
        <Icon id="edit3" color={tw`text-primary-main`.color} size={16} />
      </View>
      <TouchableOpacity onPress={nextAddress}>
        <Icon id="arrowRightCircle" size={24} />
      </TouchableOpacity>
    </View>
  )
}
