/**
 * The short message shown at the bottom of the screen: a confirmation ("Hass avocado added to your quote") or,
 * for forms, an error listing what still needs fixing.
 */
export type ToastTone = 'info' | 'error';

export type Toast = {
  tone: ToastTone;
  /** The message, or the heading when there is a list. */
  text: string;
  /** Optional list under the heading (e.g. every field a form still needs). */
  items?: readonly string[];
};

/** How long a confirmation stays up, as in the design. */
export const TOAST_MS = 3200;
/** Errors stay up longer: there is more to read and act on. */
export const ERROR_TOAST_MS = 6500;

let current: Toast | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function show(toast: Toast, ms: number) {
  clearTimeout(timer);
  current = toast;
  emit();
  timer = setTimeout(() => {
    current = null;
    emit();
  }, ms);
}

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: (): Toast | null => current,
  getServerSnapshot: (): Toast | null => null,
  dismiss() {
    clearTimeout(timer);
    current = null;
    emit();
  },
};

/** A confirmation, e.g. "Hass avocado added to your quote". */
export function showToast(text: string) {
  show({ tone: 'info', text }, TOAST_MS);
}

/** An error, with an optional list of what to fix. */
export function showErrorToast(text: string, items?: readonly string[]) {
  show({ tone: 'error', text, ...(items?.length ? { items } : {}) }, ERROR_TOAST_MS);
}
