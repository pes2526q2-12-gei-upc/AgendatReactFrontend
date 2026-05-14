import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isBusy = false,
  onCancel,
  onConfirm,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    cancelButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isBusy) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isBusy, isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = () => {
    if (!isBusy) {
      onCancel();
    }
  };

  return (
    <div className="dialog-backdrop">
      <button
        className="dialog-backdrop__button"
        type="button"
        aria-label={cancelLabel}
        disabled={isBusy}
        onClick={handleBackdropClick}
      />
      <section
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <h2 id="dialog-title">{title}</h2>
        <p>{description}</p>
        <div className="dialog__actions">
          <button
            ref={cancelButtonRef}
            className="button button--secondary"
            type="button"
            disabled={isBusy}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="button button--danger"
            type="button"
            disabled={isBusy}
            onClick={onConfirm}
          >
            {isBusy ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  isBusy: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
