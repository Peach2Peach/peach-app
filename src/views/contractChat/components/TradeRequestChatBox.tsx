import { useEffect, useRef } from "react";
import { FlatList, Keyboard, View } from "react-native";
import { Offer69TradeRequestChatMessage } from "../../../../peach-api/src/@types/offer";
import tw from "../../../styles/tailwind";
import { TradeRequestChatMessage } from "./TradeRequestChatMessage";

type Props = {
  messages: Offer69TradeRequestChatMessage[];
  whoAmI: "offerOwner" | "tradeRequester";
  symmetricKey: string;
};

export const TradeRequestChatBox = ({
  messages,
  whoAmI,
  symmetricKey,
}: Props) => {
  const scroll = useRef<FlatList<Offer69TradeRequestChatMessage>>(null);

  useEffect(() => {
    const DELAY_BEFORE_SCROLL = 300;
    setTimeout(
      () => scroll.current?.scrollToEnd({ animated: false }),
      DELAY_BEFORE_SCROLL,
    );
  }, [messages]);

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
      data={messages}
      {...{ onContentSizeChange }}
      onScrollToIndexFailed={() => scroll.current?.scrollToEnd()}
      keyExtractor={(item) => item.creationDate + item.sender}
      renderItem={({ item, index }) => (
        <TradeRequestChatMessage
          chatMessage={item}
          whoAmI={whoAmI}
          symmetricKey={symmetricKey}
        />
      )}
      initialNumToRender={999} // TODO: CHECK THIS
      ListFooterComponent={<View style={tw`h-2`} />}
      removeClippedSubviews={false}
      //   onRefresh={fetchNextPage}
      //   refreshing={isLoading}
      scrollEventThrottle={50}
    />
  );
};
