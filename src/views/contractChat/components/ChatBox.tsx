import { useCallback, useEffect, useRef } from "react";
import { FlatList, Keyboard, View, ViewToken } from "react-native";
import { PAGE_SIZE } from "../../../hooks/query/useChatMessages";
import tw from "../../../styles/tailwind";
import { getChat } from "../../../utils/chat/getChat";
import { ChatBoxTopMessage } from "./ChatBoxTopMessage";
import { ChatMessage } from "./ChatMessage";

type Props = {
  chat: Chat;
  setAndSaveChat: (id: string, c: Partial<Chat>, save?: boolean) => void;
  resendMessage: (message: Message) => void;
  tradingPartner: User["id"];
  page: number;
  fetchNextPage: () => void;
  isLoading: boolean;
  online: boolean;
};

export const ChatBox = ({
  chat,
  setAndSaveChat,
  page,
  fetchNextPage,
  isLoading,
  ...chatMessageProps
}: Props) => {
  const scroll = useRef<FlatList<Message>>(null);
  const visibleChatMessages = chat.messages.slice(-(page + 1) * PAGE_SIZE);

  useEffect(() => {
    if (visibleChatMessages.length === 0 || page > 0) return;
    const DELAY_BEFORE_SCROLL = 300;
    setTimeout(
      () => scroll.current?.scrollToEnd({ animated: false }),
      DELAY_BEFORE_SCROLL,
    );
  }, [chat.messages.length, page, visibleChatMessages.length]);

  useEffect(() => {
    Keyboard.addListener(
      "keyboardDidShow",
      () => () => scroll.current?.scrollToEnd({ animated: false }),
    );
  }, []);

  const onContentSizeChange = () => {
    if (page === 0 && visibleChatMessages.length > 0) {
      const DELAY_BEFORE_SCROLL = 50;
      setTimeout(
        () => scroll.current?.scrollToEnd({ animated: false }),
        DELAY_BEFORE_SCROLL,
      );
    }
  };

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<ViewToken> }) => {
      const lastItem = viewableItems.pop()?.item as Message;
      const savedChat = getChat(chat.id);
      if (!lastItem || lastItem.date.getTime() <= savedChat.lastSeen.getTime())
        return;

      setAndSaveChat(chat.id, { lastSeen: lastItem.date });
    },
    [chat.id, setAndSaveChat],
  );

  return (
    <FlatList
      ref={scroll}
      data={visibleChatMessages}
      {...{ onContentSizeChange, onViewableItemsChanged }}
      onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
      keyExtractor={(item) => item.date.getTime() + item.signature}
      renderItem={({ item, index }) => (
        <ChatMessage
          chatMessages={visibleChatMessages}
          {...{ item, index, ...chatMessageProps }}
        />
      )}
      initialNumToRender={PAGE_SIZE}
      ListFooterComponent={<View style={tw`h-2`} />}
      removeClippedSubviews={false}
      onRefresh={fetchNextPage}
      refreshing={isLoading}
      scrollEventThrottle={50}
      ListHeaderComponent={<ChatBoxTopMessage isContract={true} />}
    />
  );
};
