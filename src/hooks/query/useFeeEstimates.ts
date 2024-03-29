import { ESPLORA_URL } from "@env";
import { useQuery } from "@tanstack/react-query";
import { getPublicHeaders } from "../../utils/peachAPI/getPublicHeaders";
import { parseResponse } from "../../utils/peachAPI/parseResponse";

export const placeholderFeeEstimates: ConfirmationTargets = {
  "1": 1,
  "2": 1,
  "3": 1,
  "4": 1,
  "5": 1,
  "6": 1,
  "7": 1,
  "8": 1,
  "9": 1,
  "10": 1,
  "11": 1,
  "12": 1,
  "13": 1,
  "14": 1,
  "15": 1,
  "16": 1,
  "17": 1,
  "18": 1,
  "19": 1,
  "20": 1,
  "21": 1,
  "22": 1,
  "23": 1,
  "24": 1,
  "25": 1,
  "144": 1,
  "504": 1,
  "1008": 1,
};

export const esploraKeys = {
  feeEstimates: ["feeEstimates"],
};

export const useFeeEstimates = () => {
  const { data, isFetching, error } = useQuery({
    queryKey: esploraKeys.feeEstimates,
    queryFn: getFeeEstimatesQuery,
  });
  return { feeEstimates: data || placeholderFeeEstimates, isFetching, error };
};

async function getFeeEstimatesQuery() {
  const response = await fetch(`${ESPLORA_URL}/fee-estimates`, {
    headers: getPublicHeaders(),
    method: "GET",
  });
  const [result, err] = await parseResponse<ConfirmationTargets>(
    response,
    "getFeeEstimates",
    false,
  );
  if (!result) throw new Error(err?.error || "Could not fetch fee estimates");
  return result;
}
