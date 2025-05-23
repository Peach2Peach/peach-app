import { useIsFocused } from "@react-navigation/native";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import i18n from "../../utils/i18n";
import { peachAPI } from "../../utils/peachAPI";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";

export const PAGE_SIZE = 22;

export const useTradeRequestChatMessages = ({
  offerId,
  requestingUserId,
  symmetricKey,
  isLoadingSymmetricKey,
}: {
  offerId: string;
  requestingUserId: string;
  symmetricKey?: string;
  isLoadingSymmetricKey: boolean;
}) => {
  const isFocused = useIsFocused();
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["tradeRequestChat", offerId, requestingUserId],
    queryFn: async ({ queryKey, pageParam }) => {
      const encryptedMessages = await getTradeRequestChatQuery({
        queryKey,
        pageParam,
      });
      if (!symmetricKey) {
        return encryptedMessages.map((message) => ({
          ...message,
          decrypted: false,
        }));
      }

      const decryptedMessages = await Promise.all(
        encryptedMessages.map(async (message) => {
          try {
            const decryptedMessage = await decryptSymmetric(
              message.message,
              symmetricKey,
            );
            if (message.from === "system") {
              const [textId, ...args] = decryptedMessage.split("::");
              return {
                ...message,
                message: i18n(textId, ...args),
                decrypted: !!decryptedMessage,
              };
            }
            return {
              ...message,
              message: decryptedMessage,
              decrypted: !!decryptedMessage,
            };
          } catch (e) {
            return {
              ...message,
              decrypted: false,
            };
          }
        }),
      );

      return decryptedMessages;
    },
    placeholderData: keepPreviousData,
    enabled: isFocused && !isLoadingSymmetricKey,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : null,
  });

  const messages = useMemo(() => (data?.pages || []).flat(), [data?.pages]);

  return {
    messages,
    isLoading,
    isFetching,
    error,
    page: (data?.pages.length || 1) - 1,
    fetchNextPage,
    hasNextPage,
    refetch,
  };
};

type GetTradeRequestChatQueryProps = {
  queryKey: string[];
  pageParam: number;
};
async function getTradeRequestChatQuery({
  queryKey,
  pageParam,
}: GetTradeRequestChatQueryProps) {
  const { result, error } = await peachAPI.private.offer.getTradeRequestChat({
    offerId: queryKey[1],
    requestingUserId: queryKey[2],
    page: pageParam,
  });

  if (!result || error) throw new Error(error?.error);

  return result.map((message) => ({
    ...message,
    date: new Date(message.date),
  }));
}
