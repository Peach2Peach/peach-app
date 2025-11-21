import { useMutation } from "@tanstack/react-query";
import { APPVERSION, BUILDNUMBER, SESSION_ID, UNIQUEID } from "../../constants";
import { useAppVersion } from "../../hooks/useAppVersion";
import { useAccountStore } from "../../utils/account/account";
import { sendErrors } from "../../utils/analytics/sendErrors";
import { peachAPI } from "../../utils/peachAPI";
import { compatibilityCheck } from "../../utils/system/compatibilityCheck";

type Params = {
  email: string;
  reason: string;
  topic: string;
  message: string;
  errorLogs?: Error | string;
};
export function useSendReport() {
  const { data } = useAppVersion();
  const publicKey = useAccountStore((state) => state.account.publicKey);
  return useMutation({
    mutationFn: (params: Params) =>
      sendReport(params, data?.minAppVersion, publicKey),
  });
}

async function sendReport(
  params: Params,
  minAppVersion: string | undefined,
  publicKey?: string,
) {
  const { email, reason, topic, message, errorLogs } = params;
  let messageToSend = `${message}\n\nUser ID: ${publicKey || "No public key available"}`;
  messageToSend += `\n\nDevice ID Hash: ${UNIQUEID}`;
  messageToSend += `\n\nApp version: ${APPVERSION} (${BUILDNUMBER})`;
  if (
    minAppVersion &&
    !compatibilityCheck(`${APPVERSION} ${BUILDNUMBER}`, minAppVersion)
  ) {
    messageToSend += `\nUser is using an outdated app version! Min version required is: ${minAppVersion}`;
  }

  messageToSend += `\n\nUser shared app logs, please check crashlytics\nSession ID: ${SESSION_ID}`;

  if (errorLogs) {
    if (errorLogs instanceof Error) {
      messageToSend += `\n\nLocal Error logs: Name: ${errorLogs.name} // Message: ${errorLogs.message} // Stack: ${errorLogs.stack}`;
    } else {
      messageToSend += `\n\nLocal Error logs: ${errorLogs}`;
    }
  }

  sendErrors([new Error(`user shared app logs: ${topic} - ${messageToSend}`)]);

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
