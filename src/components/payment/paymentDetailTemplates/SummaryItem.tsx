import { NETWORK } from '@env'
import { BlurView } from '@react-native-community/blur'
import { TouchableOpacity, View } from 'react-native'
import { ConditionalWrapper, Icon, Text } from '../..'
import { useIsMediumScreen } from '../../../hooks'
import tw from '../../../styles/tailwind'
import { showAddress } from '../../../utils/bitcoin'
import i18n from '../../../utils/i18n'
import { BTCAmount } from '../../bitcoin'

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

export const SummaryItem = ({ label, value }: { label: JSX.Element; value: JSX.Element }) => (
  <View style={tw`flex-row justify-between`}>
    {label}
    {value}
  </View>
)

export function TextSummaryItem ({
  isEscrow,
  information,
  isBitcoinAmount,
  isDisputeActive = false,
  isAvailable = true,
  shouldBlur = false,
  icon,
}: Props) {
  const isMediumScreen = useIsMediumScreen()

  return (
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
      <View style={tw`flex-row items-center justify-end flex-1 gap-2`}>
        {isBitcoinAmount ? (
          <BTCAmount amount={information} size={isMediumScreen ? 'small' : 'x small'} isError={isDisputeActive} />
        ) : (
          <Text
            style={[
              tw`shrink subtitle-1 top-1px`,
              tw.md`subtitle-0 top-2px`,
              isDisputeActive && tw`text-error-dark`,
              isEscrow && tw`underline`,
              !isAvailable && (isDisputeActive ? tw`text-error-mild` : tw`text-black-5`),
            ]}
          >
            {isEscrow ? i18n('contract.summary.viewInExplorer') : information}
          </Text>
        )}
        {shouldBlur && <BlurView style={tw`absolute h-full -left-2 -right-2`} blurType="light" blurAmount={3} />}

        {!shouldBlur
          && (isEscrow ? (
            <Icon id="externalLink" style={[tw`w-4 h-4`, tw.md`w-5 h-5`]} color={tw`text-primary-main`.color} />
          ) : (
            !!icon && !isDisputeActive && isAvailable && icon
          ))}
      </View>
    </ConditionalWrapper>
  )
}
