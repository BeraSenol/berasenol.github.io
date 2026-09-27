/**
 * Where to reach Bera, written once.
 *
 * Same reasoning as stack.ts and locales.ts: the splash pills, the contact
 * rows, the DGT Studio Pro button and the footer all point at the same inbox
 * and the same GitHub account, whichever language the page is in. Before this
 * file the address was typed out in three places and the GitHub URL in five,
 * so changing either meant finding all of them.
 */
export const EMAIL = "berasenol@icloud.com";

export const GITHUB_URL = "https://github.com/BeraSenol";

/** The GitHub URL as the contact row shows it, without the scheme. */
export const GITHUB_DISPLAY = GITHUB_URL.replace("https://", "");
