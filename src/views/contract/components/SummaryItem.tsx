import { TextProps, View } from 'react-native'
import { Text } from '../../../components'
import { CopyAble } from '../../../components/ui/CopyAble'
import tw from '../../../styles/tailwind'

type Props = {
  label: string
  value: JSX.Element
}

export const SummaryItem = ({ label, value }: Props) => (
  <View style={tw`flex-row items-center justify-between gap-3`}>
    <Text style={[tw`text-black-2`, tw`md:body-l`]}>{label}</Text>
    {value}
  </View>
)

type TextValueProps = {
  value: string
  copyable?: boolean
  copyValue?: string
  onPress?: TextProps['onPress']
}

function TextValue ({ value, copyable = false, copyValue = value, onPress }: TextValueProps) {
  return (
    <View style={tw`flex-row items-center justify-end flex-1 gap-10px`}>
      <Text style={[tw`flex-1 text-right subtitle-1`, tw`md:subtitle-0`]} onPress={onPress}>
        {value}
      </Text>
      {copyable && <CopyAble value={copyValue} style={tw`md:w-5 md:h-5`} />}
    </View>
  )
}

SummaryItem.Text = TextValue
