import { useEffect, useState } from "react"
import { getConsent, setConsent } from "../../lib/consent"

const CookieConsent = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (getConsent() === null) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    setConsent("accepted")
    setVisible(false)
  }

  const handleDecline = () => {
    setConsent("declined")
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card/95 p-5 shadow-lg backdrop-blur sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          <p className="font-semibold text-foreground">We use cookies</p>
          <p className="mt-1 text-muted-foreground">
            We use cookies and similar technologies to understand how you use our site and
            improve your experience. See our{" "}
            <a
              href="https://heyoto.eu/privacy"
              className="underline hover:text-foreground"
            >
              privacy policy
            </a>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleDecline}
            className="inline-flex items-center rounded-lg border border-primary/30 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="inline-flex items-center rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
