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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-surface-light shadow-2xl transition-all dark:bg-surface-dark"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4 dark:border-border-dark">
          <h3 className="flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-400">
            <FiAlertTriangle />
            {t('deleteModal.title')}
          </h3>
          <button
            className="rounded-lg p-1 text-text-secondary-light transition-colors hover:bg-background-light hover:text-text-primary-light dark:text-text-secondary-dark dark:hover:bg-background-dark dark:hover:text-text-primary-dark"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col gap-2">
            <p className="font-medium text-text-primary-light dark:text-text-primary-dark">
              {t('deleteModal.confirmText', { itemName })}
            </p>
            <p className="rounded-lg bg-background-light p-3 text-sm font-medium text-text-secondary-light dark:bg-background-dark dark:text-text-secondary-dark">
              "{itemTitle}"
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {t('deleteModal.warningNote', { itemName })}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg bg-background-light px-4 py-2 font-medium text-text-primary-light transition-colors hover:bg-gray-200 dark:bg-background-dark dark:text-text-primary-dark dark:hover:bg-gray-700"
              disabled={isLoading}
            >
              {t('deleteModal.cancel')}
            </button>
            <button
              onClick={onConfirm}
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? t('deleteModal.deleting') : t('deleteModal.deletePermanently')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
