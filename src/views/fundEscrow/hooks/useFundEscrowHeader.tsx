import { networks } from 'bitcoinjs-lib'
import { useCancelOffer, useHeaderSetup } from '../../../hooks'
import { useCancelFundMultipleSellOffers } from '../../../hooks/useCancelFundMultipleSellOffers'
import { useShowHelp } from '../../../hooks/useShowHelp'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { generateBlock } from '../../../utils/regtest'
import { getNetwork } from '../../../utils/wallet'
import { FundMultipleInfo } from '../../../utils/wallet/walletStore'

type Props = {
  fundingStatus: FundingStatus
  sellOffer?: SellOffer
  fundMultiple?: FundMultipleInfo
}
export const useFundEscrowHeader = ({ fundingStatus, sellOffer, fundMultiple }: Props) => {
  const showHelp = useShowHelp('escrow')
  const showMempoolHelp = useShowHelp('mempool')
  const cancelOffer = useCancelOffer(sellOffer)
  const cancelFundMultipleOffers = useCancelFundMultipleSellOffers({ fundMultiple })

  const headerConfig
    = fundingStatus.status === 'MEMPOOL'
      ? {
        title: i18n('sell.funding.mempool.title'),
        icons: [{ ...headerIcons.help, onPress: showMempoolHelp }],
      }
      : {
        title: i18n('sell.escrow.title'),
        icons: [
          { ...headerIcons.cancel, onPress: fundMultiple ? cancelFundMultipleOffers : cancelOffer },
          { ...headerIcons.help, onPress: showHelp },
        ],
      }

  if (getNetwork() === networks.regtest) {
    headerConfig.icons.unshift({ ...headerIcons.generateBlock, onPress: generateBlock })
  }
  useHeaderSetup(headerConfig)
}
