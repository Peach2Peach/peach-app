import { TouchableOpacity } from 'react-native'
import { Text } from '../../../components'
import { Icon } from '../../../components/Icon'
import { TouchableIcon } from '../../../components/TouchableIcon'
import { MeansOfPayment } from '../../../components/offer/MeansOfPayment'
import { useNavigation } from '../../../hooks'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { hasMopsConfigured } from '../../../utils/offer/hasMopsConfigured'
import { Section } from './Section'

export function Methods ({ type, meansOfPayment }: { type: 'buy' | 'sell'; meansOfPayment: MeansOfPayment }) {
  const navigation = useNavigation()
  const onPress = () => navigation.navigate('paymentMethods')
  const hasSelectedMethods = hasMopsConfigured(meansOfPayment)

  const backgroundColor = type === 'buy' ? tw.color('success-mild-1') : tw.color('primary-background-dark')
  const color = tw.color('black-1')
  return (
    <>
      {hasSelectedMethods ? (
        <Section.Container style={[tw`flex-row items-start`, { backgroundColor }]}>
          <MeansOfPayment meansOfPayment={meansOfPayment} style={tw`flex-1`} />
          <TouchableIcon id="plusCircle" iconSize={24} onPress={onPress} iconColor={color} style={tw`pt-1`} />
        </Section.Container>
      ) : (
        <Section.Container style={{ backgroundColor }}>
          <TouchableOpacity style={tw`flex-row items-center gap-10px`} onPress={onPress}>
            <Icon size={24} id="plusCircle" color={color} />
            <Text style={[tw`subtitle-1`, { color }]}>{i18n.break('paymentMethod.select.button.remote')}</Text>
          </TouchableOpacity>
        </Section.Container>
      )}
    </>
  )
}
