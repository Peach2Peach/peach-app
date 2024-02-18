import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Contract } from "../../../peach-api/src/@types/contract";
import { Header } from "../../components/Header";
import { Screen } from "../../components/Screen";
import { MessageInput } from "../../components/inputs/MessageInput";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { MSINASECOND } from "../../constants";
import { PAGE_SIZE, useChatMessages } from "../../hooks/query/useChatMessages";
import {
  contractKeys,
  useContractDetail,
} from "../../hooks/query/useContractDetail";
import { useRoute } from "../../hooks/useRoute";
import { useShowErrorBanner } from "../../hooks/useShowErrorBanner";
import { OpenDisputePopup } from "../../popups/dispute/OpenDisputePopup";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { deleteMessage } from "../../utils/chat/deleteMessage";
import { getChat } from "../../utils/chat/getChat";
import { getUnsentMessages } from "../../utils/chat/getUnsentMessages";
import { saveChat } from "../../utils/chat/saveChat";
import { contractIdToHex } from "../../utils/contract/contractIdToHex";
import { getTradingPartner } from "../../utils/contract/getTradingPartner";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { error } from "../../utils/log/error";
import { parseError } from "../../utils/parseError";
import { useWebsocketContext } from "../../utils/peachAPI/websocket";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { signAndEncryptSymmetric } from "../../utils/pgp/signAndEncryptSymmetric";
import { LoadingScreen } from "../loading/LoadingScreen";
import { ChatBox } from "./components/ChatBox";
import { useDecryptedContractData } from "./useDecryptedContractData";

export const ContractChat = () => {
  const { contractId } = useRoute<"contractChat">().params;
  const { contract } = useContractDetail(contractId);

  return !contract ? <LoadingScreen /> : <ChatScreen contract={contract} />;
};

function ChatScreen({ contract }: { contract: Contract }) {
  const queryClient = useQueryClient();
  const { data: decryptedData } = useDecryptedContractData(contract);
  const { contractId } = useRoute<"contractChat">().params;

  const { connected, send, off, on } = useWebsocketContext();
  const {
    messages,
    isFetching,
    error: messagesError,
    page,
    fetchNextPage,
  } = useChatMessages({
    contractId,
    symmetricKey: decryptedData?.symmetricKey,
  });
  const showError = useShowErrorBanner();
  const account = useAccountStore((state) => state.account);
  const tradingPartner = contract ? getTradingPartner(contract, account) : null;
  const [chat, setChat] = useState(getChat(contractId));
  const [newMessage, setNewMessage] = useState(chat.draftMessage);
  const [disableSend, setDisableSend] = useState(false);

  const setAndSaveChat = useCallback(
    (id: string, c: Partial<Chat>, save = true) =>
      setChat(saveChat(id, c, save)),
    [],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!tradingPartner || !decryptedData?.symmetricKey || !message) return;

      const encryptedResult = await signAndEncryptSymmetric(
        message,
        decryptedData.symmetricKey,
      );
      const messageObject: Message = {
        roomId: `contract-${contractId}`,
        from: account.publicKey,
        date: new Date(),
        readBy: [],
        message,
        signature: encryptedResult.signature,
      };
      if (connected) {
        send(
          JSON.stringify({
            path: "/v1/contract/chat",
            contractId,
            message: encryptedResult.encrypted,
            signature: encryptedResult.signature,
          }),
        );
      }

      setAndSaveChat(
        contractId,
        {
          messages: [messageObject],
          lastSeen: new Date(),
        },
        false,
      );
    },
    [
      tradingPartner,
      decryptedData?.symmetricKey,
      contractId,
      account.publicKey,
      connected,
      setAndSaveChat,
      send,
    ],
  );
  const resendMessage = (message: Message) => {
    if (!connected) return;
    deleteMessage(contractId, message);
    sendMessage(message.message);
  };

  const submit = () => {
    if (
      !contract ||
      !tradingPartner ||
      !decryptedData?.symmetricKey ||
      !newMessage
    )
      return;
    setDisableSend(true);
    const enableDelay = 300;
    setTimeout(() => setDisableSend(false), enableDelay);

    sendMessage(newMessage);
    setNewMessage("");
    setAndSaveChat(contractId, {
      draftMessage: "",
    });
  };

  useEffect(
    () => () => {
      setAndSaveChat(contractId, {
        draftMessage: newMessage,
      });
    },
    [contractId, newMessage, setAndSaveChat],
  );

  useEffect(() => {
    const timeoutSeconds = 5;
    const timeout = setTimeout(() => {
      const unsentMessages = getUnsentMessages(chat.messages);
      if (unsentMessages.length === 0) return;

      setAndSaveChat(contractId, {
        messages: unsentMessages.map((message) => ({
          ...message,
          failedToSend: true,
        })),
      });
    }, timeoutSeconds * MSINASECOND);

    return () => clearTimeout(timeout);
  }, [contractId, chat.messages, setAndSaveChat]);

  useEffect(() => {
    const chatMessageHandler = async (message?: Message) => {
      if (!message) return;
      if (!contract || !decryptedData?.symmetricKey) return;
      if (!message.message || message.roomId !== `contract-${contract.id}`)
        return;

      let messageBody = "";
      try {
        messageBody = await decryptSymmetric(
          message.message,
          decryptedData.symmetricKey,
        );
      } catch {
        error(
          new Error(`Could not decrypt message for contract ${contract.id}`),
        );
      }
      const decryptedMessage = {
        ...message,
        date: new Date(message.date),
        message: messageBody,
      };
      setAndSaveChat(contractId, {
        messages: [decryptedMessage],
      });
      queryClient.setQueryData(
        contractKeys.chat(contractId),
        (oldQueryData: InfiniteData<Message[]> | undefined) => {
          if (!oldQueryData) {
            return { pageParams: [], pages: [[decryptedMessage]] };
          }
          if (oldQueryData.pages.length > PAGE_SIZE)
            oldQueryData.pages[0].shift();
          oldQueryData.pages[0] = [decryptedMessage, ...oldQueryData.pages[0]];
          return oldQueryData;
        },
      );
      if (!message.readBy.includes(account.publicKey)) {
        send(
          JSON.stringify({
            path: "/v1/contract/chat/received",
            contractId: contract.id,
            start: message.date,
            end: message.date,
          }),
        );
      }
    };
    const unsubscribe = () => {
      off("message", chatMessageHandler);
    };

    if (!connected) return unsubscribe;
    on("message", chatMessageHandler);
    return unsubscribe;
  }, [
    contract,
    contractId,
    connected,
    on,
    send,
    off,
    decryptedData?.symmetricKey,
    account.publicKey,
    queryClient,
    setAndSaveChat,
  ]);

  useEffect(() => {
    if (messages) setAndSaveChat(contractId, { messages });
  }, [contractId, messages, setAndSaveChat]);

  useEffect(() => {
    if (messagesError) showError(parseError(messagesError));
  }, [messagesError, showError]);

  return (
    <Screen
      style={tw`p-0`}
      header={
        <ContractChatHeader
          contract={contract}
          symmetricKey={decryptedData?.symmetricKey}
        />
      }
    >
      <View
        style={[tw`flex-1`, !decryptedData?.symmetricKey && tw`opacity-50`]}
      >
        <ChatBox
          tradingPartner={tradingPartner?.id || ""}
          online={connected}
          chat={chat}
          setAndSaveChat={setAndSaveChat}
          page={page}
          fetchNextPage={fetchNextPage}
          isLoading={isFetching}
          resendMessage={resendMessage}
        />
      </View>
      {contract.isChatActive ? (
        <View style={tw`w-full`}>
          <MessageInput
            onChangeText={setNewMessage}
            onSubmit={submit}
            disabled={!decryptedData?.symmetricKey}
            disableSubmit={disableSend}
            value={newMessage}
          />
        </View>
      ) : (
        <PeachText style={tw`p-4 text-center text-black-50`}>
          {i18n("chat.disabled")}
        </PeachText>
      )}
    </Screen>
  );
}

type Props = {
  contract: Contract;
  symmetricKey?: string;
};

function ContractChatHeader({ contract, symmetricKey }: Props) {
  const { contractId } = useRoute<"contractChat">().params;

  const setPopup = useSetPopup();

  const memoizedIcons = useMemo(() => {
    if (contract?.disputeActive) return [];

    const icons = [];
    if (!!symmetricKey && !contract.disputeActive) {
      icons.push({
        ...headerIcons.warning,
        onPress: () => setPopup(<OpenDisputePopup contractId={contractId} />),
      });
    }
    return icons;
  }, [contract, contractId, setPopup, symmetricKey]);

  return <Header title={contractIdToHex(contractId)} icons={memoizedIcons} />;
}
