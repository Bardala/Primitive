// components/DeleteConfirmationModal.tsx
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemTitle: string;
  isLoading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemTitle,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FiAlertTriangle className="modal-icon warning" />
            Confirm Deletion
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="confirmation-content">
            <p className="warning-text">Are you sure you want to delete this {itemName}?</p>
            <p className="item-title">{itemTitle}</p>
            <p className="warning-note">
              This action cannot be undone. All data associated with this {itemName} will be
              permanently removed.
            </p>
          </div>

          <div className="confirmation-actions">
            <button onClick={onClose} className="btn-secondary" disabled={isLoading}>
              Cancel
            </button>
            <button onClick={onConfirm} className="btn-danger" disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
