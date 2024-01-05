import { TouchableOpacity, View } from 'react-native'
import { useGoToOfferOrContract } from '../../hooks/useGoToOfferOrContract'
import tw from '../../styles/tailwind'
import { contractIdFromHex } from '../../utils/contract/contractIdFromHex'
import { isDisplayContractId } from '../../utils/contract/isDisplayContractId'
import i18n from '../../utils/i18n'
import { offerIdFromHex } from '../../utils/offer/offerIdFromHex'
import { groupChars } from '../../utils/string/groupChars'
import { priceFormat } from '../../utils/string/priceFormat'
import { Icon } from '../Icon'
import { BTCAmount } from '../bitcoin/btcAmount/BTCAmount'
import { FixedHeightText } from '../text/FixedHeightText'
import { PeachText } from '../text/PeachText'
import { statusCardStyles } from './statusCardStyles'

type StatusCardProps = {
  title: string
  icon?: JSX.Element
  subtext: string
  amount?: number | [number, number]
  price?: number
  premium?: number
  currency?: Currency
  label?: string
  labelIcon?: JSX.Element
  onPress: () => void
  unreadMessages?: number
  color: keyof typeof statusCardStyles.bg
  replaced?: boolean
}

export const StatusCard = ({
  icon,
  title,
  subtext,
  replaced,
  amount,
  price,
  premium,
  currency,
  color,
  onPress,
  label,
  labelIcon,
  unreadMessages,
}: StatusCardProps) => (
  <TouchableOpacity
    style={[tw`overflow-hidden border rounded-xl bg-primary-background-light`, tw.style(statusCardStyles.border[color])]}
    onPress={onPress}
  >
    <View style={tw`flex-row items-center justify-between gap-2 px-4 py-3`}>
      <Left icon={icon} title={title} subtext={subtext} replaced={replaced} />
      <Right amount={amount} price={price} currency={currency} premium={premium} replaced={replaced} />
    </View>

    {label !== undefined && (
      <View style={[tw`flex-row items-center justify-between gap-1 px-4 py-6px`, statusCardStyles.bg[color]]}>
        <Icon id="messageFull" size={24} style={tw`opacity-0`} color={tw.color(statusCardStyles.text[color])} />
        <View style={tw`flex-row items-center gap-1`}>
          {labelIcon}
          <PeachText style={[tw`subtitle-1`, tw.style(statusCardStyles.text[color])]}>{label}</PeachText>
        </View>
        <View style={[tw`items-center justify-center w-7 h-7`, !unreadMessages && tw`opacity-0`]}>
          <Icon id="messageFull" size={24} color={tw.color('primary-background-light')} />
          <PeachText style={tw`absolute text-center font-baloo-bold`}>{unreadMessages}</PeachText>
        </View>
      </View>
    )}
  </TouchableOpacity>
)

type LeftProps = Pick<StatusCardProps, 'icon' | 'title' | 'subtext' | 'replaced'>
type RightProps = Pick<StatusCardProps, 'amount' | 'price' | 'currency' | 'replaced' | 'premium'>

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

function Right (propsWithoutType: RightProps) {
  const { type, amount, price, currency, premium } = getPropsWithType(propsWithoutType)
  return (
    <View
      style={[
        tw`items-end pt-4px pb-1px w-141px h-40px`,
        ['amount', 'fiatAmount'].includes(type) && tw`gap-6px`,
        type === 'empty' && tw`w-px`,
      ]}
    >
      {type === 'range' ? (
        <View style={tw`items-center -gap-1`}>
          <BTCAmount size="small" amount={amount[0]} />
          <PeachText style={tw`font-baloo-medium text-12px leading-19px text-black-50`}>~</PeachText>
          <BTCAmount size="small" amount={amount[1]} />
        </View>
      ) : type === 'fiatAmount' ? (
        <>
          <BTCAmount size="small" amount={amount} />
          <FixedHeightText style={tw`body-m text-black-65`} height={17}>
            {currency === 'SAT' ? groupChars(String(price), 3) : priceFormat(price)} {currency}
          </FixedHeightText>
        </>
      ) : (
        type === 'amount' && (
          <>
            <BTCAmount size="small" amount={amount} />
            {premium !== undefined && (
              <FixedHeightText style={tw`body-m text-black-65`} height={17}>
                {premium}% {i18n('offer.summary.premium')}
              </FixedHeightText>
            )}
          </>
        )
      )}
    </View>
  )
}

type Empty = {
  type: 'empty'
} & Partial<RightProps>

type Amount = {
  type: 'amount'
  amount: number
} & Partial<RightProps>
const isAmount = (props: RightProps): props is Omit<Amount, 'type'> => typeof props.amount === 'number'

type FiatAmount = {
  type: 'fiatAmount'
  amount: number
} & Required<RightProps>
const isFiatAmount = (props: RightProps): props is Omit<FiatAmount, 'type'> =>
  typeof props.amount === 'number' && props.price !== undefined && props.currency !== undefined

type Range = {
  type: 'range'
  amount: [number, number]
} & Partial<RightProps>

const isRange = (props: RightProps): props is Omit<Range, 'type'> => Array.isArray(props.amount)

function getPropsWithType (props: RightProps): Empty | FiatAmount | Range | Amount {
  if (props.replaced) return { ...props, type: 'empty' }
  if (isRange(props)) return { ...props, type: 'range' }
  if (isFiatAmount(props)) return { ...props, type: 'fiatAmount' }
  if (isAmount(props)) return { ...props, type: 'amount' }
  return { ...props, type: 'empty' }
}
