import { APPVERSION, BUILDNUMBER, UNIQUEID } from "../../../constants";

type Props = {
  message: string;
  shareDeviceID: boolean;
  shareLogs: boolean;
};

export const buildReportMessage = ({
  message,
  shareDeviceID,
  shareLogs,
}: Props) => {
  let messageToSend = message;
  if (shareDeviceID) messageToSend += `\n\nDevice ID Hash: ${UNIQUEID}`;
  messageToSend += `\n\nApp version: ${APPVERSION} (${BUILDNUMBER})`;

  if (shareLogs)
    messageToSend += "\n\nUser shared app logs, please check crashlytics";

  return messageToSend;
};
