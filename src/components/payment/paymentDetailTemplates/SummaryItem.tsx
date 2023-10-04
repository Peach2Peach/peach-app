import { View } from 'react-native'
import { CopyAble, Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { PaymentMethodBubble } from '../../bubble'

type Props = {
  label: string
  value: JSX.Element
}

export const SummaryItem = ({ label, value }: Props) => (
  <View style={tw`flex-row items-center justify-between`}>
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
    <View style={tw`flex-row items-center justify-end gap-10px`}>
      <Text style={[tw`subtitle-1`, tw.md`subtitle-0`]}>{value}</Text>
      {copyable && <CopyAble value={value} style={tw.md`w-5 h-5`} />}
    </View>
  )
}

function NoReference () {
  return (
    <View style={tw`flex-row items-center justify-end gap-10px`}>
      <Text style={[tw`subtitle-1 text-black-5`, tw.md`subtitle-0`]}>{i18n('none')}</Text>
    </View>
  )
}

SummaryItem.Text = TextValue
SummaryItem.PaymentMethod = PaymentMethodBubble
SummaryItem.NoReference = NoReference
