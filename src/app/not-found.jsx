import ErrorState from '@/components/ui/ErrorState';

// Renders for any unmatched route, and for every explicit notFound() call
// (e.g. product/[id]/page.jsx when the product doesn't exist).
export default function NotFound() {
  return (
    <ErrorState
      code={404}
      title="Page Not Found"
      message="The page you're looking for doesn't exist, was moved, or the piece has sold out and been retired from the catalogue."
      primaryHref="/"
      primaryLabel="Back to Home"
      secondaryHref="/shop/ready-to-wear"
      secondaryLabel="Continue Shopping"
    />
  );
}
