import { useIsFocused } from '@react-navigation/native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getChat } from '../../utils/peachAPI'
import { decryptSymmetric } from '../../utils/pgp'

const PAGE_SIZE = 22

type GetChatQueryProps = {
  queryKey: [string, string]
  pageParam?: number
}
const getChatQuery = async ({ queryKey, pageParam = 0 }: GetChatQueryProps) => {
  const [, contractId] = queryKey
  const [messages, error] = await getChat({
    contractId,
    page: pageParam,
  })

  if (!messages || error) throw new Error(error?.error)

  return messages
}

const getDecryptedChat
  = (symmetricKey: string) =>
    async ({ queryKey, pageParam = 0 }: GetChatQueryProps) => {
      const messages = await getChatQuery({ queryKey, pageParam })

      return await Promise.all(
        messages.map(async (message) => {
          try {
            const decrypted = await decryptSymmetric(message.message, symmetricKey)
            return {
              ...message,
              message: decrypted,
              decrypted: !!decrypted,
            }
          } catch (e) {
            return {
              ...message,
              decrypted: false,
            }
          }
        }),
      )
    }

export const useChatMessages = (id: string, symmetricKey?: string) => {
  const isFocused = useIsFocused()
  const { data, isLoading, error, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
    queryKey: ['contract-chat', id],
    queryFn: symmetricKey ? getDecryptedChat(symmetricKey) : () => [],
    keepPreviousData: true,
    enabled: !!symmetricKey && isFocused,
    refetchInterval: 1000,
    getNextPageParam: (lastPage, allPages) => lastPage.length === PAGE_SIZE ? allPages.length : null,
  })

  const messages = useMemo(() => (data?.pages || []).flat(), [data?.pages])

  return {
    messages,
    isLoading,
    error,
    page: (data?.pages.length || 1) - 1,
    fetchNextPage,
    hasNextPage,
    refetch,
  }
}
