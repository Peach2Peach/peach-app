import { TextProps, View } from 'react-native'
import { PeachText } from '../../../components/text/PeachText'
import { CopyAble } from '../../../components/ui/CopyAble'
import tw from '../../../styles/tailwind'

type Props = {
  label: string
  value: JSX.Element
}

export const SummaryItem = ({ label, value }: Props) => (
  <View style={tw`flex-row items-center justify-between gap-3`}>
    <PeachText style={[tw`text-black-65`, tw`md:body-l`]}>{label}</PeachText>
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
      <PeachText style={[tw`flex-1 text-right subtitle-1`, tw`md:subtitle-0`]} onPress={onPress}>
        {value}
      </PeachText>
      {copyable && <CopyAble value={copyValue} style={tw`md:w-5 md:h-5`} />}
    </View>
  )
}

SummaryItem.Text = TextValue
