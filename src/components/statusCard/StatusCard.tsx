import { TouchableOpacity, View } from 'react-native'
import { useGoToOfferOrContract } from '../../hooks/useGoToOfferOrContract'
import tw from '../../styles/tailwind'
import { contractIdFromHex } from '../../utils/contract/contractIdFromHex'
import { isDisplayContractId } from '../../utils/contract/isDisplayContractId'
import { offerIdFromHex } from '../../utils/offer/offerIdFromHex'
import { Icon } from '../Icon'
import { FixedHeightText } from '../text/FixedHeightText'
import { statusCardStyles } from './statusCardStyles'

type StatusCardProps = {
  title: string
  icon?: JSX.Element
  subtext: string
  onPress: () => void
  color: keyof typeof statusCardStyles.bg
  replaced?: boolean
  label?: JSX.Element
  info?: JSX.Element
}

export function StatusCard ({ title, icon, subtext, color, replaced, onPress, label, info }: StatusCardProps) {
  return (
    <TouchableOpacity
      style={[
        tw`overflow-hidden border rounded-xl bg-primary-background-light`,
        tw.style(statusCardStyles.border[color]),
      ]}
      onPress={onPress}
    >
      <View style={tw`flex-row items-center justify-between gap-2 px-4 py-3`}>
        <Left icon={icon} title={title} subtext={subtext} replaced={replaced} />

        {info}
      </View>
      {label}
    </TouchableOpacity>
  )
}

type LeftProps = Pick<StatusCardProps, 'icon' | 'title' | 'subtext' | 'replaced'>

function Left ({ icon, title, subtext, replaced = false }: LeftProps) {
  const goToNewOffer = useGoToOfferOrContract()
  const onPress = async () => {
    const newOfferOrContractID = isDisplayContractId(subtext) ? contractIdFromHex(subtext) : offerIdFromHex(subtext)
    await goToNewOffer(newOfferOrContractID)
  }
  return (
    <View style={tw`gap-1 shrink`}>
      <FixedHeightText height={17} style={[tw`subtitle-1`, replaced && tw`text-black-50`]} numberOfLines={1}>
        {title}
      </FixedHeightText>

      <View style={tw`flex-row items-center gap-6px`}>
        {replaced ? <Icon id="cornerDownRight" color={tw.color('black-100')} size={17} /> : !!icon && icon}
        <FixedHeightText
          style={[
            tw`body-s text-black-65`,
            replaced && tw`underline subtitle-2 text-black-100`,
            (!!icon || replaced) && tw`w-100px`,
          ]}
          height={17}
          onPress={replaced ? onPress : undefined}
          suppressHighlighting={!replaced}
        >
          {subtext}
        </FixedHeightText>
      </View>
    </View>
  )
}
