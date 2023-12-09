import { TouchableOpacity } from 'react-native'
import { Icon, Text, TouchableIcon } from '../../../components'
import { MeansOfPayment } from '../../../components/offer/MeansOfPayment'
import { useNavigation } from '../../../hooks'
import { useOfferPreferences } from '../../../store/offerPreferenes'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { hasMopsConfigured } from '../../../utils/offer'
import { SectionContainer } from './SectionContainer'

export function Methods ({ type = 'sell' }: { type: 'buy' | 'sell' }) {
  const navigation = useNavigation()
  const onPress = () => navigation.navigate('paymentMethods')
  const meansOfPayment = useOfferPreferences((state) => state.meansOfPayment)
  const hasSelectedMethods = hasMopsConfigured(meansOfPayment)

  const backgroundColor = type === 'buy' ? tw.color('success-mild-1') : tw.color('primary-background-dark')
  const color = type === 'buy' ? tw.color('success-main') : tw.color('primary-main')
  return (
    <>
      {hasSelectedMethods ? (
        <SectionContainer style={[tw`flex-row items-start`, { backgroundColor }]}>
          <MeansOfPayment meansOfPayment={meansOfPayment} style={tw`flex-1`} />
          <TouchableIcon id="plusCircle" onPress={onPress} iconColor={color} style={tw`pt-1`} />
        </SectionContainer>
      ) : (
        <SectionContainer style={{ backgroundColor }}>
          <TouchableOpacity style={tw`flex-row items-center gap-10px`} onPress={onPress}>
            <Icon size={16} id="plusCircle" color={color} />
            <Text style={[tw`subtitle-2`, { color }]}>{i18n.break('paymentMethod.select.button.remote')}</Text>
          </TouchableOpacity>
        </SectionContainer>
      )}
    </>
  )
}
