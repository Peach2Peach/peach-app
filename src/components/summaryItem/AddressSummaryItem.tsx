import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { ShortBitcoinAddress } from '../bitcoin/ShortBitcoinAddress'
import { Text } from '../text'
import { CopyAble } from '../ui/CopyAble'
import { SummaryItem, SummaryItemProps } from './SummaryItem'

type Props = SummaryItemProps & {
  address?: string
}

export const AddressSummaryItem = ({ address, ...props }: Props) => (
  <SummaryItem {...props}>
    <View style={tw`flex-row items-center gap-2`}>
      {address ? (
        <ShortBitcoinAddress style={tw`subtitle-1`} address={address} />
      ) : (
        <Text style={tw`subtitle-1`}>{i18n('loading')}</Text>
      )}
      <CopyAble value={address} />
    </View>
  </SummaryItem>
)
