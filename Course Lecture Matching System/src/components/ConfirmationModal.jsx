import { XCircle, AlertTriangle } from 'lucide-react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <XCircle className="h-6 w-6 text-error" />;
      case 'warning':
      default:
        return <AlertTriangle className="h-6 w-6 text-warning" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn-error';
      case 'warning':
      default:
        return 'btn-warning';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {getIcon()}
            <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          </div>
          
          <p className="text-neutral-600 mb-6">{message}</p>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`${getButtonClass()} flex-1`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;

