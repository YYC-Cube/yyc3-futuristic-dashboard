import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment: process.env.NEXT_PUBLIC_ENV || "development",

  enabled: process.env.NODE_ENV === "production",

  tracesSampleRate: 1.0,

  integrations: [
    Sentry.httpIntegration({
      breadcrumbs: true,
    }),
  ],

  beforeSend(event, hint) {
    if (event.exception) {
      console.error("[Sentry Server]", event.exception);
    }
    return event;
  },
});
