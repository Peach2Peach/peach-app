import { useState } from 'react'
import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { Text } from '../../components'
import { Screen } from '../../components/Screen'
import { CopyAble } from '../../components/ui/CopyAble'
import { HorizontalLine } from '../../components/ui/HorizontalLine'
import { useIsMediumScreen } from '../../hooks'
import tw from '../../styles/tailwind'
import { getBitcoinAddressParts } from '../../utils/bitcoin/getBitcoinAddressParts'
import i18n from '../../utils/i18n'
import { BitcoinLoading } from '../loading/BitcoinLoading'
import { AddressNavigation } from './components'
import { useLastUnusedAddress, useWalletAddress } from './hooks'

export const ReceiveBitcoin = () => {
  const { data: lastUnusedAddress } = useLastUnusedAddress()
  const [index, setIndex] = useState<number>()
  const displayIndex = index ?? lastUnusedAddress?.index ?? 0
  const { isLoading } = useWalletAddress(displayIndex)

  if (isLoading) return <BitcoinLoading />

  return (
    <Screen header={i18n('wallet.receiveBitcoin.title')}>
      <View style={[tw`items-center flex-1 gap-2 py-1`, tw`md:gap-8 md:py-6`]}>
        <AddressNavigation setIndex={setIndex} index={displayIndex} />

        <HorizontalLine />

        <View style={tw`items-center self-stretch justify-center gap-4`}>
          <AddressQRCode index={displayIndex} />
          <BitcoinAddress index={displayIndex} />
        </View>
      </View>
    </Screen>
  )
}

const MEDIUM_SIZE = 327
const SMALL_SIZE = 275
function AddressQRCode ({ index }: { index: number }) {
  const { data } = useWalletAddress(index)
  const isMediumScreen = useIsMediumScreen()
  return (
    <>
      <QRCode
        value={data?.address}
        size={isMediumScreen ? MEDIUM_SIZE : SMALL_SIZE}
        color={String(tw.color('black-1'))}
      />
      {data?.used && (
        <Text
          style={[
            tw`text-center h3 text-error-main`,
            tw`absolute self-center p-1 overflow-hidden rounded-xl bg-opacity-65 top-110px bg-primary-background-light`,
            tw`md:top-135px md:bg-opacity-85`,
          ]}
        >
          {i18n('wallet.address.used')}
        </Text>
      )}
    </>
  )
}

function BitcoinAddress ({ index }: { index: number }) {
  const { data } = useWalletAddress(index)
  const address = data?.address ?? ''
  const isUsed = data?.used ?? false
  const addressParts = getBitcoinAddressParts(address)
  return (
    <View style={tw`flex-row items-center self-stretch gap-3 px-1`}>
      <Text style={tw`shrink text-black-3 body-l`}>
        {addressParts.one}
        <Text style={tw`body-l`}>{addressParts.two}</Text>
        {addressParts.three}
        <Text style={tw`body-l`}>{addressParts.four}</Text>
      </Text>
      <CopyAble value={address} style={tw`w-6 h-6`} color={isUsed ? tw`text-primary-mild-1` : tw`text-primary-main`} />
    </View>
  )
}
