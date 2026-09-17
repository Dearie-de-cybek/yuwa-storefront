import Link from 'next/link';
import { SearchX, ServerCrash, CloudOff, RefreshCw } from 'lucide-react';

const ICONS = {
  404: SearchX,
  500: ServerCrash,
  502: CloudOff,
  503: CloudOff,
};

/**
 * Shared full-page error state — used by not-found.jsx, error.jsx and
 * global-error.jsx so every failure mode (missing page, server crash,
 * upstream/DB unreachable) reads as one consistent, on-brand screen instead
 * of Next's default blank error page.
 */
export default function ErrorState({
  code = 500,
  title,
  message,
  primaryHref = '/',
  primaryLabel = 'Back to Home',
  secondaryHref,
  secondaryLabel,
  onRetry,
}) {
  const Icon = ICONS[code] || ServerCrash;

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-6 animate-fade-in">
      <div className="max-w-lg w-full text-center">
        <Icon className="mx-auto mb-8 text-accent" size={40} strokeWidth={1.25} />

        <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-muted mb-4">
          Error {code}
        </span>

        <h1 className="font-serif text-4xl md:text-5xl italic mb-6 text-primary">
          {title}
        </h1>

        <p className="text-sm text-muted leading-relaxed mb-10">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent transition-colors w-full sm:w-auto justify-center"
            >
              <RefreshCw size={14} /> Try Again
            </button>
          )}

          <Link
            href={primaryHref}
            className={`inline-flex items-center justify-center px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors w-full sm:w-auto ${
              onRetry
                ? 'border border-primary text-primary hover:bg-primary hover:text-white'
                : 'bg-primary text-white hover:bg-accent'
            }`}
          >
            {primaryLabel}
          </Link>

          {secondaryHref && (
            <Link
              href={secondaryHref}
              className="text-xs text-muted underline decoration-dotted hover:text-primary transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
