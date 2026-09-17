// ============================================================
// FORM FIELD — Wrapper with error display
// ============================================================

export default function FormField({ error, children }) {
  return (
    <div className="space-y-1">
      {children}
      {error && <p className="text-red-500 text-xs font-medium">{error.message}</p>}
    </div>
  );
}