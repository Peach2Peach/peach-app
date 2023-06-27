import { PrimaryButton } from '../../../components'
import i18n from '../../../utils/i18n'
import { useBumpFees } from '../hooks/useBumpFees'

type Props = {
  transaction?: Transaction | null
  newFeeRate: string
  sendingAmount: number
  disabled?: boolean
}
export const BumpNetworkFeesButton = ({ transaction, newFeeRate, sendingAmount, disabled }: Props) => {
  const bumpFees = useBumpFees({ transaction, newFeeRate: Number(newFeeRate), sendingAmount })

  return (
    <PrimaryButton disabled={disabled} onPress={bumpFees} narrow>
      {i18n('confirm')}
    </PrimaryButton>
  )
}
