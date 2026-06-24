import posthog from "posthog-js"

import type { AnalyticsProvider } from "../analytics"

type PostHogOptions = {
  apiKey: string
  apiHost?: string
  uiHost?: string
}

const DEFAULT_API_HOST = "https://t.heyoto.eu"
const DEFAULT_UI_HOST = "https://eu.posthog.com"

let initialized = false

/**
 * Creates an analytics provider that captures events directly with the
 * PostHog browser SDK, talking to a managed reverse proxy (default
 * `t.heyoto.eu`) so requests survive ad-blockers and stay first-party.
 *
 * PostHog handles pageleave, autocapture, and web vitals on its own.
 * Pageviews are captured manually via `trackPageView` so callers can pass
 * custom properties (`capture_pageview: false` disables the SDK's
 * automatic firing). Marketing attribution (`$initial_referrer`,
 * `utm_*`) is persisted natively by posthog-js as first-touch profile
 * properties, so we don't need to manage it ourselves.
 *
 * The marketing site has no authenticated users; PostHog's own anonymous
 * distinct ID is used. `identify` is forwarded for the rare case where a
 * known user_id is supplied (e.g. demo booking).
 */
export function createPostHogProvider({
  apiKey,
  apiHost = DEFAULT_API_HOST,
  uiHost = DEFAULT_UI_HOST,
}: PostHogOptions): AnalyticsProvider {
  if (!initialized) {
    posthog.init(apiKey, {
      api_host: apiHost,
      ui_host: uiHost,
      // Pageviews are captured manually via `trackPageView` so callers can
      // attach custom metadata; otherwise the SDK would silently drop it.
      // Astro is an MPA, so every navigation is a full page load and a single
      // call per init is all we need.
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
      // Web vitals (LCP, CLS, INP, FCP) + Resource Timing.
      capture_performance: {
        web_vitals: true,
        network_timing: true,
      },
      // Session recording is intentionally disabled: heavy on PostHog quota
      // and carries extra privacy surface area we don't currently need.
      disable_session_recording: true,
      persistence: "localStorage+cookie",
      person_profiles: "identified_only",
    })
    initialized = true
  }

  // `opt_out_capturing` is persisted in PostHog's storage. If the visitor
  // previously declined and is now accepting again, the SDK would otherwise
  // silently drop everything, so re-opt-in on init.
  if (posthog.has_opted_out_capturing()) {
    posthog.opt_in_capturing()
  }

  return {
    trackPageView(properties) {
      posthog.capture("$pageview", properties)
    },
    trackEvent(name, properties) {
      posthog.capture(name, properties)
    },
    identify(userId, properties) {
      posthog.identify(userId, properties)
    },
    reset() {
      // `reset()` only clears the distinct_id; on its own, autocapture,
      // `$pageleave`, and web-vitals would keep firing after opt-out.
      // Opt out first so the SDK actually stops sending events (and
      // persists the decision across reloads), then clear identity.
      posthog.opt_out_capturing()
      posthog.reset()
    },
  }
}
