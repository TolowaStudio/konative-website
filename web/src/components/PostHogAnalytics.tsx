'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

function stripQuery(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

export default function PostHogAnalytics() {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (!token) return;
    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com', defaults: '2026-05-30',
      autocapture: false, capture_dead_clicks: false, capture_exceptions: false, capture_heatmaps: false,
      capture_pageview: 'history_change', capture_pageleave: false, disable_session_recording: true,
      disable_surveys: true, mask_all_element_attributes: true, mask_all_text: true, person_profiles: 'never',
      rageclick: false, respect_dnt: true,
      before_send: (event) => {
        if (!event) return event;
        for (const key of ['$current_url', '$referrer']) {
          const value = event.properties?.[key];
          if (typeof value === 'string') {
            const sanitized = stripQuery(value);
            if (sanitized) event.properties![key] = sanitized;
            else delete event.properties![key];
          }
        }
        return event;
      },
    });
    const capture = (event: Event) => {
      const detail = (event as CustomEvent<{ event?: string; properties?: Record<string, string> }>).detail;
      if (detail?.event) posthog.capture(detail.event, detail.properties);
    };
    const captureDiscoveryCta = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href*="cal.com"]') : null;
      if (link) posthog.capture('discovery_cta_clicked', { placement: window.location.pathname });
    };
    window.addEventListener('tolowa:analytics', capture);
    document.addEventListener('click', captureDiscoveryCta);
    return () => {
      window.removeEventListener('tolowa:analytics', capture);
      document.removeEventListener('click', captureDiscoveryCta);
    };
  }, []);
  return null;
}
