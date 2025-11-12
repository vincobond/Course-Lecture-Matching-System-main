import { AlertTriangle, X } from 'lucide-react';

function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemName,
  itemType = "item",
  isLoading = false 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        {/* Header */}
        <div className="flex items-start justify-between p-3 sm:p-4 sm:p-6 border-b border-neutral-200">
          <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 leading-tight">{title}</h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 sm:p-2 text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50 flex-shrink-0 touch-manipulation"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 sm:p-6">
          <div className="mb-3 sm:mb-4">
            <p className="text-sm sm:text-base text-neutral-700 mb-2 sm:mb-3 leading-relaxed">{message}</p>
            {itemName && (
              <div className="bg-neutral-50 rounded-lg p-2 sm:p-3 border border-neutral-200">
                <p className="text-xs sm:text-sm font-medium text-neutral-900 break-words">
                  {itemType}: <span className="text-neutral-700">{itemName}</span>
                </p>
              </div>
            )}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-red-800">Warning</p>
                <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                  Deleting this {itemType} will permanently remove all associated data and cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 sm:p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 text-sm sm:text-base touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base touch-manipulation"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Delete {itemType}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
