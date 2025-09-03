// components/DeleteConfirmationModal.tsx
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FiAlertTriangle className="modal-icon warning" />
            {t('deleteModal.title')}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="confirmation-content">
            <p className="warning-text">{t('deleteModal.confirmText', { itemName })}</p>
            <p className="item-title">{itemTitle}</p>
            <p className="warning-note">{t('deleteModal.warningNote', { itemName })}</p>
          </div>

          <div className="confirmation-actions">
            <button onClick={onClose} className="btn-secondary" disabled={isLoading}>
              {t('deleteModal.cancel')}
            </button>
            <button onClick={onConfirm} className="btn-danger" disabled={isLoading}>
              {isLoading ? t('deleteModal.deleting') : t('deleteModal.deletePermanently')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
