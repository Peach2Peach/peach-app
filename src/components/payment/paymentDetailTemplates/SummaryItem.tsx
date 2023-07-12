import { NETWORK } from '@env'
import { TouchableOpacity, View } from 'react-native'
import { ConditionalWrapper, Icon, Text } from '../..'
import tw from '../../../styles/tailwind'
import { showAddress } from '../../../utils/bitcoin'
import { BTCAmount } from '../../bitcoin'
import { BlurView } from '@react-native-community/blur'
import { useIsMediumScreen } from '../../../hooks'
import i18n from '../../../utils/i18n'

type Props = {
  label?: string
  icon?: JSX.Element
  isDisputeActive?: boolean
  isEscrow?: boolean
  isAvailable?: boolean
  shouldBlur?: boolean
} & (
  | { information: string | JSX.Element; isBitcoinAmount?: false }
  | { information: number; isBitcoinAmount: true; isEscrow?: false }
)

export const SummaryItem = ({
  label,
  information,
  isDisputeActive = false,
  icon,
  isBitcoinAmount,
  isEscrow,
  isAvailable = true,
  shouldBlur = false,
}: Props) => {
  const isMediumScreen = useIsMediumScreen()
  return (
    <View style={tw`flex-row items-center gap-2`}>
      <Text style={[tw`text-black-3 w-18`, tw.md`input-text w-78px mr-1`, isDisputeActive && tw`text-error-light`]}>
        {isEscrow ? i18n('escrow') : isBitcoinAmount ? i18n('amount') : label}
      </Text>
      <ConditionalWrapper
        condition={!!isEscrow}
        wrapper={(children: JSX.Element) =>
          typeof information === 'string' ? (
            <TouchableOpacity style={tw`flex-row items-center gap-2`} onPress={() => showAddress(information, NETWORK)}>
              {children}
            </TouchableOpacity>
          ) : (
            <></>
          )
        }
      >
        <View style={tw`flex-1 flex-row items-center gap-2`}>
          {isBitcoinAmount ? (
            <BTCAmount amount={information} size={isMediumScreen ? 'small' : 'x small'} isError={isDisputeActive} />
          ) : (
            <Text
              style={[
                tw`subtitle-2 top-1px flex-shrink`,
                tw.md`input-title top-2px`,
                isDisputeActive && tw`text-error-dark`,
                isEscrow && tw`underline`,
                !isAvailable && (isDisputeActive ? tw`text-error-mild` : tw`text-black-5`),
              ]}
            >
              {isEscrow ? i18n('contract.summary.viewInExplorer') : information}
            </Text>
          )}
          {shouldBlur && <BlurView style={tw`absolute h-full -left-2 -right-2`} blurType="light" blurAmount={3} />}

          {!shouldBlur &&
            (isEscrow ? (
              <Icon id="externalLink" style={[tw`w-4 h-4`, tw.md`w-5 h-5`]} color={tw`text-primary-main`.color} />
            ) : (
              !!icon && !isDisputeActive && isAvailable && icon
            ))}
        </View>
      </ConditionalWrapper>
    </View>
  )
}
