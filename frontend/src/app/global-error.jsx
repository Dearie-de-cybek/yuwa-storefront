'use client';

import { useEffect } from 'react';
import './globals.css';
import ErrorState from '@/components/ui/ErrorState';

// Only fires when the ROOT LAYOUT itself throws — a true worst case, since
// layout.jsx (and everything it renders, including Providers) is gone. Must
// supply its own <html>/<body>; keep this file's own dependencies minimal
// since we can't assume anything above it survived.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-secondary text-primary font-sans">
        <ErrorState
          code={500}
          title="Something Went Wrong"
          message="The application hit a critical error and couldn't load. Reloading usually fixes this."
          onRetry={reset}
          primaryHref="/"
          primaryLabel="Reload Home"
        />
      </body>
    </html>
  );
}
