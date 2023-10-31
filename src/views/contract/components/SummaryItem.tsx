import { View } from 'react-native'
import { CopyAble, Text } from '../../../components'
import tw from '../../../styles/tailwind'

type Props = {
  label: string
  value: JSX.Element
}

export const SummaryItem = ({ label, value }: Props) => (
  <View style={tw`flex-row items-center justify-between gap-3`}>
    <Text style={[tw`text-black-2`, tw.md`body-l`]}>{label}</Text>
    {value}
  </View>
)

type TextValueProps = {
  value: string
  copyable?: boolean
}

function TextValue ({ value, copyable = false }: TextValueProps) {
  return (
    <View style={tw`flex-row items-center justify-end flex-1 gap-10px`}>
      <Text style={[tw`flex-1 text-right subtitle-1`, tw.md`subtitle-0`]}>{value}</Text>
      {copyable && <CopyAble value={value} style={tw.md`w-5 h-5`} />}
    </View>
  )
}

SummaryItem.Text = TextValue
