import { View } from 'react-native'
import { useGoToOfferOrContract } from '../../hooks/useGoToOfferOrContract'
import tw from '../../styles/tailwind'
import Icon from '../Icon'
import { FixedHeightText } from './FixedHeightText'

type Props = {
  icon?: JSX.Element
  title: string
  subtext: string
  replaced?: boolean
}

export const Left = ({ icon, title, subtext, replaced = false }: Props) => {
  const goToNewOffer = useGoToOfferOrContract()
  return (
    <View style={tw`gap-1`}>
      <FixedHeightText height={17} style={[tw`subtitle-1`, replaced && tw`text-black-3`]}>
        {title}
      </FixedHeightText>

      <View style={tw`flex-row gap-6px`}>
        {replaced ? (
          <Icon id="cornerDownRight" color={tw`text-black-1`.color} style={tw`w-17px h-17px`} />
        ) : (
          !!icon && icon
        )}
        <FixedHeightText
          style={[tw`body-s text-black-2`, replaced && tw`underline subtitle-2 text-black-1`]}
          height={17}
          onPress={async () => {
            if (!replaced) return
            await goToNewOffer(subtext)
          }}
          suppressHighlighting={!replaced}
        >
          {subtext}
        </FixedHeightText>
      </View>
    </View>
  )
}
