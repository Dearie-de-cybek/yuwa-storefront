// ============================================================
// Shared UI primitives for product editor
// ============================================================

export function Section({ title, subtitle, actions, children }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-base">{title}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Field({ label, hint, compact, children }) {
  return (
    <div>
      <label className={`block font-bold uppercase text-gray-500 ${compact ? 'text-[10px] mb-1' : 'text-xs mb-2'}`}>
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export function IconButton({ onClick, icon: Icon, size = 16, danger, disabled, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        danger
          ? 'hover:bg-red-50 text-red-400 hover:text-red-600'
          : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
      } disabled:opacity-20`}
    >
      <Icon size={size} />
    </button>
  );
}

export function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
    >
      {children}
    </button>
  );
}