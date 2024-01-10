import { shallow } from 'zustand/shallow'
import { useContractDetails } from '../../hooks/query/useContractDetails'
import { useOfferDetails } from '../../hooks/query/useOfferDetails'
import { useNavigation } from '../../hooks/useNavigation'
import { useRoute } from '../../hooks/useRoute'
import { useSettingsStore } from '../../store/settingsStore/useSettingsStore'
import { useAccountStore } from '../../utils/account/account'
import { getMessageToSignForAddress } from '../../utils/account/getMessageToSignForAddress'
import { getOfferIdFromContract } from '../../utils/contract/getOfferIdFromContract'
import { isValidBitcoinSignature } from '../../utils/validation/isValidBitcoinSignature'
import { NewLoadingScreen } from '../loading/LoadingScreen'
import { CustomAddressScreen } from '../settings/CustomAddressScreen'
import { usePatchReleaseAddress } from './components/usePatchReleaseAddress'

export const PatchPayoutAddress = () => {
  const { params } = useRoute<'patchPayoutAddress'>()

  if ('contractId' in params) {
    return <ContractSuspense contractId={params.contractId} />
  }

  return <OfferSuspense offerId={params.offerId} />
}

function OfferSuspense ({ offerId }: { offerId: string }) {
  const { offer } = useOfferDetails(offerId)

  if (!offer) return <NewLoadingScreen />
  if (offer.type === 'ask') throw new Error('Cannot patch payout address for sell offers')

  return <PatchOfferAddress defaultAddress={offer.releaseAddress} offerId={offerId} />
}

function ContractSuspense ({ contractId }: { contractId: string }) {
  const { contract } = useContractDetails(contractId)

  if (!contract) return <NewLoadingScreen />

  return (
    <PatchOfferAddress
      defaultAddress={contract.releaseAddress}
      offerId={getOfferIdFromContract(contract)}
      contractId={contractId}
    />
  )
}

type ScreenContentProps = {
  defaultAddress: string
  offerId: string
  contractId?: string
}

function PatchOfferAddress ({ defaultAddress, offerId, contractId }: ScreenContentProps) {
  const navigation = useNavigation()

  const [payoutAddress, payoutAddressLabel, messageSignature] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel, state.payoutAddressSignature],
    shallow,
  )

  const defaultLabel = payoutAddress === defaultAddress ? payoutAddressLabel || '' : ''

  const publicKey = useAccountStore((state) => state.account.publicKey)

  const { mutate: patchPayoutAddress } = usePatchReleaseAddress(offerId, contractId)

  const onSave = (address: string, addressLabel: string) => {
    const message = getMessageToSignForAddress(publicKey, address)
    const signatureRequired = !messageSignature || !isValidBitcoinSignature(message, address, messageSignature)

    if (signatureRequired) {
      const commonProps = { address, addressLabel }
      const uniqueProps = contractId ? { contractId } : { offerId }
      navigation.replace('signMessage', { ...commonProps, ...uniqueProps })
    } else {
      patchPayoutAddress(
        { releaseAddress: address, messageSignature },
        {
          onSuccess: () => {
            navigation.goBack()
          },
        },
      )
    }
  }

  return (
    <CustomAddressScreen isPayout onSave={onSave} defaultAddress={defaultAddress} defaultAddressLabel={defaultLabel} />
  )
}
