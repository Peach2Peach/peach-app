import React from 'react'
import { SectionListData, Text } from 'react-native'
import LinedText from '../../../components/ui/LinedText'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type SectionHeaderProps = {
  section: SectionListData<TradeSummary, { title: string; data: TradeSummary[] }>
}
export const SectionHeader = ({ section: { title, data } }: SectionHeaderProps) =>
  data.length !== 0 && title !== 'priority' ? (
    <LinedText style={tw`py-7`}>
      <Text style={tw`text-black-2 body-m`}>{i18n(`yourTrades.${title}`)}</Text>
    </LinedText>
  ) : (
    <></>
  )
