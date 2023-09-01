import { SectionListData } from 'react-native'
import { Text } from '../../../components'
import { LinedText } from '../../../components/ui/LinedText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type SectionHeaderProps = {
  section: SectionListData<TradeSummary, { title: string; data: TradeSummary[] }>
}
export const SectionHeader = ({ section: { title, data } }: SectionHeaderProps) =>
  data.length !== 0 && title !== 'priority' ? (
    <LinedText style={tw`pb-7 bg-primary-background`}>
      <Text style={tw`text-black-2`}>{i18n(`yourTrades.${title}`)}</Text>
    </LinedText>
  ) : null
