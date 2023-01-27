/* eslint-disable max-lines */
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import tw from '../../styles/tailwind'

import { useFocusEffect } from '@react-navigation/native'
import { Loading } from '../../components'
import MessageInput from '../../components/inputs/MessageInput'
import { MessageContext } from '../../contexts/message'
import { OverlayContext } from '../../contexts/overlay'
import getContractEffect from '../../effects/getContractEffect'
import getOfferDetailsEffect from '../../effects/getOfferDetailsEffect'
import { useHeaderSetup, useNavigation, useRoute, useThrottledEffect } from '../../hooks'
import { useConfirmCancelTrade } from '../../overlays/tradeCancelation/useConfirmCancelTrade'
import { account } from '../../utils/account'
import { decryptMessage, getChat, popUnsentMessages, saveChat } from '../../utils/chat'
import {
  getContract,
  getOfferHexIdFromContract,
  getOfferIdFromContract,
  getTradingPartner,
  saveContract,
} from '../../utils/contract'
import i18n from '../../utils/i18n'
import { error, info } from '../../utils/log'
import { saveOffer } from '../../utils/offer'
import { PeachWSContext } from '../../utils/peachAPI/websocket'
import { decryptSymmetric, signAndEncryptSymmetric } from '../../utils/pgp'
import { decryptContractData } from '../../utils/contract/decryptContractData'
import { handleOverlays } from '../../overlays/handleOverlays'
import ChatBox from './components/ChatBox'
import { getHeaderChatActions } from './utils/getHeaderChatActions'
import getMessagesEffect from './utils/getMessagesEffect'
import { useShowDisputeDisclaimer } from './utils/useShowDisputeDisclaimer'
import { useContractChatSetup } from './hooks/useContractChatSetup'

// eslint-disable-next-line max-statements, max-lines-per-function
export default (): ReactElement => {
  const {
    contract,
    chat,
    setAndSaveChat,
    tradingPartner,
    ws,
    page,
    loadMore,
    loadingMessages,
    onChangeMessage,
    submit,
    disableSend,
    newMessage,
  } = useContractChatSetup()
  return !contract ? (
    <View style={tw`items-center justify-center w-full h-full`}>
      <Loading />
    </View>
  ) : (
    <View style={[tw`flex-col h-full`]}>
      <View style={[tw`flex-shrink w-full h-full`, !contract.symmetricKey ? tw`opacity-50` : {}]}>
        <ChatBox
          chat={chat}
          setAndSaveChat={setAndSaveChat}
          tradingPartner={tradingPartner?.id || ''}
          online={ws.connected}
          page={page}
          loadMore={loadMore}
          loading={loadingMessages}
        />
      </View>
      {!contract.canceled || contract.disputeActive ? (
        <View style={tw`w-full bg-white-1`}>
          <MessageInput
            onChange={onChangeMessage}
            onSubmit={submit}
            disabled={!contract.symmetricKey}
            disableSubmit={disableSend}
            value={newMessage}
            placeholder={i18n('chat.yourMessage')}
          />
        </View>
      ) : null}
    </View>
  )
}
