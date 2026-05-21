import { useEffect, useRef } from "react";
import { FlatList, Keyboard, View } from "react-native";
import { Offer69TradeRequestChatMessage } from "../../../../peach-api/src/@types/offer";
import tw from "../../../styles/tailwind";
import { ChatBoxTopMessage } from "./ChatBoxTopMessage";
import { TradeRequestChatMessage } from "./TradeRequestChatMessage";

export type PendingChatMessage = {
  optimisticId: string;
  plaintext: string;
  creationDate: string;
  sender: "offerOwner" | "tradeRequester";
};

type DisplayItem =
  | { kind: "real"; data: Offer69TradeRequestChatMessage }
  | { kind: "pending"; data: PendingChatMessage };

type Props = {
  messages: Offer69TradeRequestChatMessage[];
  pendingMessages?: PendingChatMessage[];
  whoAmI: "offerOwner" | "tradeRequester";
  symmetricKey: string;
};

export const TradeRequestChatBox = ({
  messages,
  pendingMessages,
  whoAmI,
  symmetricKey,
}: Props) => {
  const scroll = useRef<FlatList<DisplayItem>>(null);

  const items: DisplayItem[] = [
    ...messages.map((m) => ({ kind: "real" as const, data: m })),
    ...(pendingMessages ?? []).map((m) => ({
      kind: "pending" as const,
      data: m,
    })),
  ];

  useEffect(() => {
    const DELAY_BEFORE_SCROLL = 300;
    setTimeout(
      () => scroll.current?.scrollToEnd({ animated: false }),
      DELAY_BEFORE_SCROLL,
    );
  }, [messages, pendingMessages]);

  useEffect(() => {
    Keyboard.addListener(
      "keyboardDidShow",
      () => () => scroll.current?.scrollToEnd({ animated: false }),
    );
  }, []);

  const onContentSizeChange = () => {
    const DELAY_BEFORE_SCROLL = 50;
    setTimeout(
      () => scroll.current?.scrollToEnd({ animated: false }),
      DELAY_BEFORE_SCROLL,
    );
  };

  return (
    <FlatList
      ref={scroll}
      data={items}
      {...{ onContentSizeChange }}
      onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
      keyExtractor={(item) =>
        item.kind === "pending"
          ? `pending-${item.data.optimisticId}`
          : item.data.creationDate + item.data.sender
      }
      renderItem={({ item }) =>
        item.kind === "pending" ? (
          <TradeRequestChatMessage
            chatMessage={{
              id: -1,
              encryptedMessage: "",
              creationDate: item.data.creationDate,
              seen: false,
              sender: item.data.sender,
            }}
            whoAmI={whoAmI}
            symmetricKey={symmetricKey}
            plaintext={item.data.plaintext}
          />
        ) : (
          <TradeRequestChatMessage
            chatMessage={item.data}
            whoAmI={whoAmI}
            symmetricKey={symmetricKey}
          />
        )
      }
      initialNumToRender={999} // TODO: CHECK THIS
      ListFooterComponent={<View style={tw`h-2`} />}
      removeClippedSubviews={false}
      //   onRefresh={fetchNextPage}
      //   refreshing={isLoading}
      scrollEventThrottle={50}
      ListHeaderComponent={<ChatBoxTopMessage isContract={false} />}
    />
  );
};
