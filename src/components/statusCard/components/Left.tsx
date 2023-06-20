import { View } from 'react-native'
import { useGoToOfferOrContract } from '../../../hooks'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'
import { FixedHeightText } from '../../text/FixedHeightText'
import { StatusCardProps } from '../StatusCard'

type Props = Pick<StatusCardProps, 'icon' | 'title' | 'subtext' | 'replaced'>

export const Left = ({ icon, title, subtext, replaced = false }: Props) => {
  const goToNewOffer = useGoToOfferOrContract()
  const onPress = async () => {
    if (!replaced) return
    const newOfferOrContractID = subtext
    await goToNewOffer(newOfferOrContractID)
  }
  return (
    <View style={tw`flex-shrink gap-1`}>
      <FixedHeightText height={17} style={[tw`subtitle-1`, replaced && tw`text-black-3`]}>
        {title}
      </FixedHeightText>

      <View style={tw`flex-row items-center gap-6px`}>
        {replaced ? (
          <Icon id="cornerDownRight" color={tw`text-black-1`.color} style={tw`w-17px h-17px`} />
        ) : (
          !!icon && icon
        )}
        <FixedHeightText
          style={[
            tw`body-s text-black-2`,
            replaced && tw`underline subtitle-2 text-black-1`,
            (!!icon || replaced) && tw`w-100px`,
          ]}
          height={17}
          onPress={onPress}
          suppressHighlighting={!replaced}
        >
          {subtext}
        </FixedHeightText>
      </View>
    </View>
  )
}
