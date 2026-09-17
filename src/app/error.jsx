'use client';

import { useEffect, useMemo } from 'react';
import ErrorState from '@/components/ui/ErrorState';

// Signatures that mean "we couldn't reach an upstream dependency" (DB down,
// connection refused, timeout) rather than a genuine bug in our own code —
// shown as a 502/503-style "temporarily unavailable" message instead of a
// generic crash message, without ever leaking the raw error to the user.
const UPSTREAM_SIGNATURE = /P1001|P1008|P1017|ECONNREFUSED|ETIMEDOUT|fetch failed|network/i;

export default function GlobalRouteError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isUpstream = useMemo(
    () => UPSTREAM_SIGNATURE.test(`${error?.message || ''}`),
    [error]
  );

  if (isUpstream) {
    return (
      <ErrorState
        code={502}
        title="Service Temporarily Unavailable"
        message="We're having trouble reaching our servers right now. This is usually brief — please try again in a moment."
        onRetry={reset}
        primaryHref="/"
        primaryLabel="Go Home"
      />
    );
  }

  return (
    <ErrorState
      code={500}
      title="Something Went Wrong"
      message="An unexpected error occurred on our end. Our team has been notified — please try again, or head back to the homepage."
      onRetry={reset}
      primaryHref="/"
      primaryLabel="Go Home"
    />
  );
}
