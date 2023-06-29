import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { ShortBitcoinAddress } from '../bitcoin'
import { CopyAble } from '../ui'
import { SummaryItem, SummaryItemProps } from './SummaryItem'
import i18n from '../../utils/i18n'
import { Text } from '../text'

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
