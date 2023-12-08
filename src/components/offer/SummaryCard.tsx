import { View } from 'react-native'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Text } from '../text'
import { MeansOfPayment } from './MeansOfPayment'

export const SummaryCard = ({ children }: ComponentProps) => (
  <View style={tw`items-center gap-4 px-5 border border-black-5 rounded-2xl py-7 bg-primary-background-light`}>
    {children}
  </View>
)

const SummarySection = ({ children }: ComponentProps) => <View style={tw`items-center gap-1`}>{children}</View>

SummaryCard.Section = SummarySection

const PaymentMethods = ({ meansOfPayment }: { meansOfPayment: MeansOfPayment }) => (
  <SummaryCard.Section>
    <Text style={tw`text-center text-black-2`}>{i18n('offer.summary.withTheseMethods')}</Text>
    <MeansOfPayment meansOfPayment={meansOfPayment} style={tw`self-stretch`} />
  </SummaryCard.Section>
)

SummaryCard.PaymentMethods = PaymentMethods
