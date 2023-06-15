import { networks } from 'bitcoinjs-lib'
import { useCancelOffer, useHeaderSetup } from '../../../hooks'
import { useShowHelp } from '../../../hooks/useShowHelp'
import i18n from '../../../utils/i18n'
import { headerIcons } from '../../../utils/layout/headerIcons'
import { generateBlock } from '../../../utils/regtest'
import { getNetwork } from '../../../utils/wallet'

type Props = {
  fundingStatus: FundingStatus
  sellOffer?: SellOffer
}
export const useFundEscrowHeader = ({ fundingStatus, sellOffer }: Props) => {
  const showHelp = useShowHelp('escrow')
  const showMempoolHelp = useShowHelp('mempool')
  const cancelOffer = useCancelOffer(sellOffer)

  const headerConfig
    = fundingStatus.status === 'MEMPOOL'
      ? {
        title: i18n('sell.funding.mempool.title'),
        icons: [{ ...headerIcons.help, onPress: showMempoolHelp }],
      }
      : {
        title: i18n('sell.escrow.title'),
        icons: [
          { ...headerIcons.cancel, onPress: cancelOffer },
          { ...headerIcons.help, onPress: showHelp },
        ],
      }

  if (getNetwork() === networks.regtest) {
    headerConfig.icons.unshift({ ...headerIcons.generateBlock, onPress: generateBlock })
  }
  useHeaderSetup(headerConfig)
}
