import { NETWORK } from "@env";

/**
 * Peach's PGP public key, BUNDLED with the app.
 *
 * The key normally arrives from `GET /system/info` at boot and is cached in the
 * config store, defaulting to `""` until it does. That fetch can legitimately
 * never land — most visibly since the mixnet integration, whose fail-closed kill
 * switch blackholes all traffic while it connects, a window far longer than
 * boot's request timeouts. A device that has never completed one successful boot
 * fetch (fresh install, cleared data) is then left with an EMPTY recipient, and
 * everything that encrypts to Peach — raising a dispute above all — dies with
 * "openpgp: invalid argument: no encryption recipient provided".
 *
 * Bundling the key removes that dependency. It also hardens the trust model:
 * the recipient of dispute payment data is pinned in the binary instead of being
 * taken on trust from a server response on every boot.
 *
 * A server-provided key still WINS whenever there is one (see
 * `selectPeachPGPPublicKey`), so rotation never requires an app release — the
 * bundled key is only the floor for clients that were never told otherwise.
 *
 * Bundled per network on purpose: the regtest/testnet backends hold different
 * keys, and encrypting to the mainnet key there would produce ciphertext Peach
 * cannot read — worse than the missing-recipient error, because it fails
 * silently. Networks with no bundled key keep today's fetch-only behaviour.
 */
const BUNDLED_KEYS: Partial<Record<BitcoinNetwork, string>> = {
  bitcoin:
    "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nxjMEZgmmfhYJKwYBBAHaRw8BAQdAhwavTjbW3g21j/tC53Lv6EF1JrrB4kuO\nBJfQU0+wLqrNKE1pY2hhZWwgTWFua2UgPG1pY2hhZWxAcGVhY2hiaXRjb2lu\nLmNvbT7CkAQTFggAOBYhBHoExp1JjrsQ0Hh5EA/TZqkXhXr4BQJmCaZ+AhsD\nBQsJCAcCBhUKCQgLAgQWAgMBAh4BAheAAAoJEA/TZqkXhXr4TPMBAMIhcean\neETkiQaDYykhOf0czeJj+KfyUmJDnUK/MDWGAP0T/oixDBp4h2g8+H0D7H+q\nHQTwvmSDL3ylh7OAc3EdBc44BGYJpn4SCisGAQQBl1UBBQEBB0CnEzZzpEES\nspKJ3bMYT9WV0f3aMbb6tQBq8C+HVgRFMAMBCAfCeAQYFggAIBYhBHoExp1J\njrsQ0Hh5EA/TZqkXhXr4BQJmCaZ+AhsMAAoJEA/TZqkXhXr4yn8A/3mlTQZn\nmWMXa0GN7XbFrLLs1AWB7i9zx6Qm9gUMlmM+AQDQ0Pfu8jlsx/mraIA2Jwo9\nVRGx7hZR7uDF1b//mrTYCA==\n=CmCu\n-----END PGP PUBLIC KEY BLOCK-----\n",
};

export const bundledPeachPGPPublicKey = BUNDLED_KEYS[NETWORK] ?? "";
