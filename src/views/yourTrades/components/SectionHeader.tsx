import { SectionListData } from 'react-native'
import { PeachText } from '../../../components/text/PeachText'
import { LinedText } from '../../../components/ui/LinedText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type SectionHeaderProps = {
  section: SectionListData<TradeSummary, { title: string; data: TradeSummary[] }>
}
export const SectionHeader = ({ section: { title, data } }: SectionHeaderProps) =>
  data.length !== 0 && title !== 'priority' ? (
    <LinedText style={tw`pb-7 bg-primary-background`}>
      <PeachText style={tw`text-black-2`}>{i18n(`yourTrades.${title}`)}</PeachText>
    </LinedText>
  ) : null
