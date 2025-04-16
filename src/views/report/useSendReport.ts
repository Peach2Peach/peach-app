import { useMutation } from "@tanstack/react-query";
import { APPVERSION, BUILDNUMBER, SESSION_ID, UNIQUEID } from "../../constants";
import { useAppVersion } from "../../hooks/useAppVersion";
import { sendErrors } from "../../utils/analytics/sendErrors";
import { peachAPI } from "../../utils/peachAPI";
import { compatibilityCheck } from "../../utils/system/compatibilityCheck";

type Params = {
  email: string;
  reason: string;
  topic: string;
  message: string;
};
export function useSendReport() {
  const { data } = useAppVersion();
  return useMutation({
    mutationFn: (params: Params) => sendReport(params, data?.minAppVersion),
  });
}

async function sendReport(params: Params, minAppVersion: string | undefined) {
  const { email, reason, topic, message } = params;
  let messageToSend = `${message}\n\nDevice ID Hash: ${UNIQUEID}`;
  messageToSend += `\n\nApp version: ${APPVERSION} (${BUILDNUMBER})`;
  if (
    minAppVersion &&
    !compatibilityCheck(`${APPVERSION} ${BUILDNUMBER}`, minAppVersion)
  ) {
    messageToSend += `\nUser is using an outdated app version! Min version required is: ${minAppVersion}`;
  }

  messageToSend += `\n\nUser shared app logs, please check crashlytics\nSession ID: ${SESSION_ID}`;
  await sendErrors([
    new Error(`user shared app logs: ${topic} - ${messageToSend}`),
  ]);

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
