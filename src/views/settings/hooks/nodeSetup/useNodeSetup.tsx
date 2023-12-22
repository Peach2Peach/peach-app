import { BlockChainNames } from 'bdk-rn/lib/lib/enums'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { PeachText } from '../../../../components/text/PeachText'
import { useShowLoadingPopup } from '../../../../hooks/useShowLoadingPopup'
import { useToggleBoolean } from '../../../../hooks/useToggleBoolean'
import { useValidatedState } from '../../../../hooks/useValidatedState'
import { SuccessPopup } from '../../../../popups/SuccessPopup'
import { WarningPopup } from '../../../../popups/WarningPopup'
import { ClosePopupAction } from '../../../../popups/actions/ClosePopupAction'
import { LoadingPopupAction } from '../../../../popups/actions/LoadingPopupAction'
import { usePopupStore } from '../../../../store/usePopupStore'
import tw from '../../../../styles/tailwind'
import i18n from '../../../../utils/i18n'
import { useNodeConfigState } from '../../../../utils/wallet/nodeConfigStore'
import { peachWallet } from '../../../../utils/wallet/setWallet'
import { checkNodeConnection } from '../../helpers/checkNodeConnection'

const urlRules = { required: true, url: true }
export const useNodeSetup = () => {
  const showLoadingPopup = useShowLoadingPopup()
  const setPopup = usePopupStore((state) => state.setPopup)

  const [node, setCustomNode, enabled, toggleEnabled] = useNodeConfigState(
    (state) => [state, state.setCustomNode, state.enabled, state.toggleEnabled],
    shallow,
  )
  const [ssl, toggleSSL] = useToggleBoolean(node.ssl)
  const [url, setURL, isURLValid, urlErrors] = useValidatedState<string>(node.url || '', urlRules)
  const canCheckConnection = enabled && isURLValid
  const [isConnected, setIsConnected] = useState(!!node.url)

  const editConfig = () => setIsConnected(false)
  const save = (blockchainType: BlockChainNames) => {
    setCustomNode({ enabled, ssl, url, type: blockchainType })
    setIsConnected(true)
    peachWallet.setBlockchain({ enabled, ssl, url, type: blockchainType })
    peachWallet.initWallet()
  }

  const checkConnection = async () => {
    showLoadingPopup({ title: i18n('wallet.settings.node.checkingConnection') })

    const { result: nodeType, error } = await checkNodeConnection(url, ssl)
    if (nodeType) {
      return setPopup(<NodeConnectionSuccessPopup url={url} save={() => save(nodeType)} />)
    }
    return setPopup(<NodeConnectionErrorPopup error={error} />)
  }

  useEffect(() => {
    peachWallet.setBlockchain(node)
  }, [node])

  return {
    enabled,
    toggleEnabled,
    ssl,
    toggleSSL,
    isConnected,
    url,
    setURL,
    urlErrors,
    editConfig,
    canCheckConnection,
    checkConnection,
  }
}

type ErrorPopupProps = {
  error: string
}

function NodeConnectionErrorPopup ({ error }: ErrorPopupProps) {
  return (
    <WarningPopup
      title={i18n('wallet.settings.node.error.title')}
      content={<PeachText selectable>{i18n('wallet.settings.node.error.text', error)}</PeachText>}
      actions={<ClosePopupAction style={tw`justify-center`} textStyle={tw`text-black-100`} />}
    />
  )
}

type SuccessPopupProps = {
  url: string
  save: () => void
}

function NodeConnectionSuccessPopup ({ url, save }: SuccessPopupProps) {
  return (
    <SuccessPopup
      title={i18n('wallet.settings.node.success.title')}
      content={<PeachText>{i18n('wallet.settings.node.success.text', url)}</PeachText>}
      actions={
        <>
          <ClosePopupAction />
          <SaveAction {...{ save }} />
        </>
      }
    />
  )
}

function SaveAction ({ save }: Pick<SuccessPopupProps, 'save'>) {
  const closePopup = usePopupStore((state) => state.closePopup)
  const onPress = () => {
    save()
    closePopup()
  }

  return (
    <LoadingPopupAction
      onPress={onPress}
      label={i18n('wallet.settings.node.success.confirm')}
      iconId={'save'}
      reverseOrder
    />
  )
}
