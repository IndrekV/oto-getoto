export const CONSENT_STORAGE_KEY = "oto-cookie-consent"
export const CONSENT_EVENT = "oto:consent-change"

export type ConsentStatus = "accepted" | "declined"

export function getConsent(): ConsentStatus | null {
  if (typeof window === "undefined") return null
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (value === "accepted" || value === "declined") return value
    return null
  } catch {
    return null
  }
}

export function setConsent(status: ConsentStatus) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status)
  } catch {
    // Ignore: storage may be unavailable (e.g. private mode, disabled cookies)
  }
  window.dispatchEvent(new CustomEvent<ConsentStatus>(CONSENT_EVENT, { detail: status }))
}
