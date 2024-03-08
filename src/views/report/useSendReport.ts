import { useMutation } from "@tanstack/react-query";
import { APPVERSION, BUILDNUMBER, SESSION_ID, UNIQUEID } from "../../constants";
import { sendErrors } from "../../utils/analytics/sendErrors";
import { peachAPI } from "../../utils/peachAPI";

export function useSendReport() {
  return useMutation({
    mutationFn: sendReport,
  });
}

type Params = {
  email: string;
  reason: string;
  topic: string;
  message: string;
  shareDeviceID: boolean;
  shareLogs: boolean;
};
async function sendReport({
  email,
  reason,
  topic,
  message,
  shareDeviceID,
  shareLogs,
}: Params) {
  let messageToSend = message;
  if (shareDeviceID) messageToSend += `\n\nDevice ID Hash: ${UNIQUEID}`;
  messageToSend += `\n\nApp version: ${APPVERSION} (${BUILDNUMBER})`;

  if (shareLogs) {
    messageToSend += "\n\nUser shared app logs, please check crashlytics";
    messageToSend += `\nSession ID: ${SESSION_ID}`;
    sendErrors([
      new Error(`user shared app logs: ${topic} - ${messageToSend}`),
    ]);
  }

  const { result, error } = await peachAPI.public.contact.sendReport({
    email,
    reason,
    topic,
    message: messageToSend,
  });
  if (!result || error) {
    throw new Error(error?.error || "Failed to send report");
  }
  return result;
}
