export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = "Delete" }) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true">
      <div className="dialog-box card">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
