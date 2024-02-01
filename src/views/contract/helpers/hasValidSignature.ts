import OpenPGP from 'react-native-fast-openpgp'

export const hasValidSignature = async ({
  signature,
  message,
  publicKeys,
}: {
  publicKeys: { publicKey: string }[];
  signature: string;
  message: string;
}) => {
  const someSignatureIsValid = (
    await Promise.all(
      publicKeys.map(async ({ publicKey }) => {
        try {
          return await OpenPGP.verify(signature, message, publicKey)
        } catch (e) {
          return false
        }
      }),
    )
  ).some(Boolean)

  return someSignatureIsValid
}
