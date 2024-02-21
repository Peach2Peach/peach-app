import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { WebViewMessageEvent } from "react-native-webview";
import { GetFundingStatusResponseBody } from "../../../../peach-api/src/@types/api/offerAPI";
import { peachAPI } from "../../peachAPI";

type Props = {
  offerId: string,
}

export const useClaimReverseSubmarineSwap = ({ offerId }: Props) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>()

  const handleClaimMessage = async (event: WebViewMessageEvent) => {
    const data = JSON.parse(event.nativeEvent.data)
    if (data.error) {
      setError(data.error)
      return
    }

    if (data.tx) {
      const { result, error: err } = await peachAPI.public.liquid.postTx({ tx: data.tx })

      if (err) {
        setError(err.message)
        return;
      }
      if (!result) {
        setError('GENERAL_ERROR')
        return;
      }

      if (result.txId) {
        const fundingStatus: GetFundingStatusResponseBody | undefined = queryClient.getQueryData(["fundingStatus", offerId])
        if (!fundingStatus) return
  
        queryClient.setQueryData(["fundingStatus", offerId], {
          ...fundingStatus,
          fundingLiquid: {
            ...fundingStatus.fundingLiquid,
            txIds: [result.txId],
            status: "MEMPOOL"
          }
        });
      }
    }
  };

  return { handleClaimMessage, error }
}