import { useIsFocused } from "@react-navigation/native";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { useMemo } from "react";
import { peachAPI } from "../../utils/peachAPI";
import { decryptSymmetric } from "../../utils/pgp/decryptSymmetric";
import { contractKeys } from "./useContractDetail";

export const PAGE_SIZE = 22;

export const useChatMessages = ({
  contractId,
  symmetricKey,
}: {
  contractId: string;
  symmetricKey?: string;
}) => {
  const isFocused = useIsFocused();
  const { t } = useTranslate("global");
  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: contractKeys.chat(contractId),
    queryFn: async ({ queryKey, pageParam }) => {
      if (!symmetricKey) throw new Error("No symmetric key");
      const messages = await getChatQuery({ queryKey, pageParam });

      const decryptedMessages = await Promise.all(
        messages.map(async (message) => {
          try {
            const decrypted = await decryptSymmetric(
              message.message,
              symmetricKey,
            );
            if (message.from === "system") {
              const [textId, ...args] = decrypted.split("::");
              return {
                ...message,
                // @ts-ignore
                message: t(textId, ...args),
                decrypted: !!decrypted,
              };
            }
            return {
              ...message,
              message: decrypted,
              decrypted: !!decrypted,
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
    enabled: !!symmetricKey && isFocused,
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

type GetChatQueryProps = {
  queryKey: ReturnType<typeof contractKeys.chat>;
  pageParam: number;
};
async function getChatQuery({ queryKey, pageParam }: GetChatQueryProps) {
  const contractId = queryKey[2];
  const { result, error } = await peachAPI.private.contract.getChat({
    contractId,
    page: pageParam,
  });
  let messages;
  if (result) {
    messages = result.map((message) => ({
      ...message,
      date: new Date(message.date),
    }));
  }

  if (!messages || error) throw new Error(error?.error);

  return messages;
}
