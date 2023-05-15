import { NETWORK } from '@env'
import { TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { ConditionalWrapper, Icon, Text } from '../..'
import tw from '../../../styles/tailwind'
import { showAddress } from '../../../utils/bitcoin'
import { BTCAmount } from './BTCAmount'

type Props = {
  label?: string
  icon?: JSX.Element
  isDispute?: boolean
  isEscrow?: boolean
  isAvailable?: boolean
} & ({ information: string; isBitcoinAmount?: false } | { information: number; isBitcoinAmount: true; isEscrow?: false })

export const useIsMediumScreen = () => {
  const { width, height } = useWindowDimensions()
  return width > 375 && height > 690
}

export const SummaryItem = ({
  label,
  information,
  isDispute = false,
  icon,
  isBitcoinAmount,
  isEscrow,
  isAvailable = true,
}: Props) => {
  const isMediumScreen = useIsMediumScreen()
  return (
    <View style={tw`flex-row items-center gap-2 h-30px`}>
      <Text style={[tw`text-black-3 w-18`, tw.md`input-text w-78px mr-1`, isDispute && tw`text-error-light`]}>
        {isEscrow ? 'escrow' : isBitcoinAmount ? 'amount' : label}
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
        <>
          {isBitcoinAmount ? (
            <BTCAmount amount={information} size={isMediumScreen ? 'small' : 'x small'} />
          ) : (
            <Text
              style={[
                tw`text-right subtitle-2 top-1px`,
                tw.md`input-title top-2px`,
                isDispute && tw`text-error-dark`,
                isEscrow && tw`underline`,
                !isAvailable && (isDispute ? tw`text-error-mild` : tw`text-black-5`),
              ]}
            >
              {isEscrow ? 'view in explorer' : information}
            </Text>
          )}

          {isEscrow ? (
            <Icon id="externalLink" style={[tw`w-4 h-4`, tw.md`w-5 h-5`]} color={tw`text-primary-main`.color} />
          ) : (
            !!icon && !isDispute && isAvailable && icon
          )}
        </>
      </ConditionalWrapper>
    </View>
  )
}
