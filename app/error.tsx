'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="not-found-page">
      <p className="not-found-page__eyebrow font-body">Something went wrong</p>
      <h1 className="not-found-page__title font-display">We hit an unexpected error.</h1>
      <p className="not-found-page__lead font-body">
        Try again. If it keeps happening, refresh the page or return home.
      </p>
      <div className="not-found-page__actions">
        <button
          type="button"
          onClick={reset}
          className="not-found-page__cta not-found-page__cta--primary font-body"
        >
          Try again
        </button>
        <a href="/" className="not-found-page__cta font-body">
          Back to home
        </a>
      </div>
    </main>
  );
}
