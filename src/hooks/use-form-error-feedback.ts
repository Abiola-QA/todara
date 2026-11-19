'use client';

import { useCallback, useEffect, useState, type RefObject } from 'react';

import { focusFirstFormError, formErrorToast } from '@/lib/forms/form-feedback';
import { showErrorToast } from '@/lib/toast';

/**
 * For any form: call the returned function with the form's error messages after a failed submit. It shows an
 * error toast listing them and, once the errors are on screen, scrolls to the first one and focuses it.
 *
 *   const formRef = useRef<HTMLFormElement>(null);
 *   const reportErrors = useFormErrorFeedback(formRef);
 *   if (errors) { setErrors(errors); reportErrors(Object.values(errors)); }
 */
export function useFormErrorFeedback(formRef: RefObject<HTMLElement | null>) {
  const [attempt, setAttempt] = useState(0);

  // Runs after React has rendered the new error messages, so the first one can be found in the page.
  useEffect(() => {
    if (attempt && formRef.current) focusFirstFormError(formRef.current);
  }, [attempt, formRef]);

  return useCallback((messages: readonly (string | undefined)[]) => {
    const toast = formErrorToast(messages);
    showErrorToast(toast.text, toast.items);
    setAttempt((n) => n + 1);
  }, []);
}
