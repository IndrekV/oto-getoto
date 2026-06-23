export type AnalyticsProvider = {
  trackPageView(properties?: Record<string, unknown>): void
  trackEvent(name: string, properties?: Record<string, unknown>): void
  identify(userId: string, properties?: Record<string, unknown>): void
  reset(): void
}

const noopProvider: AnalyticsProvider = {
  trackPageView() {},
  trackEvent() {},
  identify() {},
  reset() {},
}

declare global {
  interface Window {
    __analytics?: AnalyticsProvider
  }
}

export function initAnalytics(provider: AnalyticsProvider) {
  if (typeof window !== "undefined") {
    window.__analytics = provider
  }
}

function getProvider(): AnalyticsProvider {
  if (typeof window !== "undefined" && window.__analytics) {
    return window.__analytics
  }
  return noopProvider
}

export const analytics = {
  trackPageView(properties?: Record<string, unknown>) {
    getProvider().trackPageView(properties)
  },
  trackEvent(name: string, properties?: Record<string, unknown>) {
    getProvider().trackEvent(name, properties)
  },
  identify(userId: string, properties?: Record<string, unknown>) {
    getProvider().identify(userId, properties)
  },
  reset() {
    getProvider().reset()
  },
}
