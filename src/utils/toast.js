import toast from 'react-hot-toast';

/**
 * Display a success toast notification
 * @param {string} message - Message to display
 */
export const showSuccess = (message) => {
  toast.success(message);
};

/**
 * Display an error toast notification
 * @param {string} message - Error message to display
 */
export const showError = (message) => {
  toast.error(message);
};

/**
 * Display a loading toast that can be updated
 * @param {string} message - Loading message
 * @returns {string} Toast ID for updating
 */
export const showLoading = (message) => {
  return toast.loading(message);
};

/**
 * Dismiss a specific toast or all toasts
 * @param {string} [toastId] - Optional toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

/**
 * Display a promise-based toast (shows loading, then success/error)
 * @param {Promise} promise - Promise to track
 * @param {Object} messages - Messages for each state
 * @param {string} messages.loading - Loading message
 * @param {string} messages.success - Success message
 * @param {string} messages.error - Error message
 */
export const showPromise = (promise, messages) => {
  return toast.promise(promise, {
    loading: messages.loading || 'Loading...',
    success: messages.success || 'Success!',
    error: messages.error || 'Something went wrong',
  });
};

export default toast;

