export type DesktopConnectionQRCode = {
  desktopConnectionId: string;
  ephemeralPgpPublicKey: string;
};

function base64Decode(str: string) {
  return decodeURIComponent(escape(atob(str)));
}

export function parseDesktopConnectionQRCode(
  qrString: string,
): DesktopConnectionQRCode | null {
  try {
    if (qrString.length > 10000) return null;
    console.log("qrString", qrString);
    const parsed = JSON.parse(qrString);
    console.log("parsed", parsed);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.desktopConnectionId !== "string" ||
      typeof parsed.ephemeralPgpPublicKey !== "string"
    ) {
      return null;
    }

    return {
      desktopConnectionId: parsed.desktopConnectionId,
      ephemeralPgpPublicKey: base64Decode(parsed.ephemeralPgpPublicKey),
    };
  } catch (err) {
    console.log(err);
    return null;
  }
}
