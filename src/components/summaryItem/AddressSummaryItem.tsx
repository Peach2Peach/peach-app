import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { ShortBitcoinAddress } from '../bitcoin'
import { CopyAble } from '../ui'
import { SummaryItem, SummaryItemProps } from './SummaryItem'

type Props = SummaryItemProps & {
  address: string
}

export const AddressSummaryItem = ({ address, ...props }: Props) => (
  <SummaryItem {...props}>
    <View style={tw`flex-row items-center gap-2`}>
      <ShortBitcoinAddress style={tw`subtitle-1`} address={address} />
      <CopyAble value={address} />
    </View>
  </SummaryItem>
)
